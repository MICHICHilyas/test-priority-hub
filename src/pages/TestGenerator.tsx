import { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import {
  Play,
  FlaskConical,
  Lightbulb,
  Copy,
  Download,
  FileCode,
  FolderTree,
  CheckSquare,
  Bug,
  Loader2,
} from 'lucide-react';

const defaultJavaCode = `package com.example.service;

import java.util.List;
import java.util.Optional;

public class UserService {
    
    private final UserRepository userRepository;
    
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    
    public Optional<User> findById(Long id) {
        if (id == null || id <= 0) {
            throw new IllegalArgumentException("ID must be positive");
        }
        return userRepository.findById(id);
    }
    
    public User create(String name, String email) {
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("Name cannot be empty");
        }
        if (email == null || !email.contains("@")) {
            throw new IllegalArgumentException("Invalid email");
        }
        User user = new User(name, email);
        return userRepository.save(user);
    }
    
    public List<User> findAll() {
        return userRepository.findAll();
    }
    
    public void delete(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("ID cannot be null");
        }
        userRepository.deleteById(id);
    }
}`;

const mockGeneratedTest = `package com.example.service.test;

import org.junit.jupiter.api.*;
import org.mockito.*;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
@DisplayName("Tests pour com.example.service.UserService")
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    @BeforeEach
    void setUp() {
        // Setup initial pour chaque test
    }

    @Nested
    @DisplayName("Tests pour findById")
    class FindByIdTests {
        
        @Test
        @DisplayName("Devrait retourner un utilisateur quand l'ID existe")
        void shouldReturnUserWhenIdExists() {
            // Given
            Long id = 1L;
            User expectedUser = new User("John", "john@example.com");
            when(userRepository.findById(id)).thenReturn(Optional.of(expectedUser));
            
            // When
            Optional<User> result = userService.findById(id);
            
            // Then
            assertTrue(result.isPresent());
            assertEquals(expectedUser, result.get());
            verify(userRepository).findById(id);
        }
        
        @Test
        @DisplayName("Devrait lancer une exception quand l'ID est null")
        void shouldThrowExceptionWhenIdIsNull() {
            // When & Then
            assertThrows(IllegalArgumentException.class, 
                () -> userService.findById(null));
        }
        
        @Test
        @DisplayName("Devrait lancer une exception quand l'ID est négatif")
        void shouldThrowExceptionWhenIdIsNegative() {
            // When & Then
            assertThrows(IllegalArgumentException.class, 
                () -> userService.findById(-1L));
        }
    }

    @Nested
    @DisplayName("Tests pour create")
    class CreateTests {
        
        @Test
        @DisplayName("Devrait créer un utilisateur avec des données valides")
        void shouldCreateUserWithValidData() {
            // Given
            String name = "John";
            String email = "john@example.com";
            User newUser = new User(name, email);
            when(userRepository.save(any(User.class))).thenReturn(newUser);
            
            // When
            User result = userService.create(name, email);
            
            // Then
            assertNotNull(result);
            assertEquals(name, result.getName());
            assertEquals(email, result.getEmail());
        }
    }
}`;

interface ClassAnalysis {
  className: string;
  packageName: string;
  methods: Array<{
    name: string;
    returnType: string;
    parameters: Array<{ name: string; type: string }>;
  }>;
  fields: Array<{ name: string; type: string }>;
  constructors: Array<{ parameters: Array<{ name: string; type: string }> }>;
}

interface TestSuggestion {
  methodName: string;
  testName: string;
  type: string;
  description: string;
  priority: number;
  checked: boolean;
}

const mockAnalysis: ClassAnalysis = {
  className: 'UserService',
  packageName: 'com.example.service',
  methods: [
    { name: 'findById', returnType: 'Optional<User>', parameters: [{ name: 'id', type: 'Long' }] },
    { name: 'create', returnType: 'User', parameters: [{ name: 'name', type: 'String' }, { name: 'email', type: 'String' }] },
    { name: 'findAll', returnType: 'List<User>', parameters: [] },
    { name: 'delete', returnType: 'void', parameters: [{ name: 'id', type: 'Long' }] },
  ],
  fields: [{ name: 'userRepository', type: 'UserRepository' }],
  constructors: [{ parameters: [{ name: 'userRepository', type: 'UserRepository' }] }],
};

const mockSuggestions: TestSuggestion[] = [
  { methodName: 'findById', testName: 'testFindById_WithValidId', type: 'equivalence', description: 'Tester avec un ID valide existant', priority: 1, checked: false },
  { methodName: 'findById', testName: 'testFindById_WithNullId', type: 'null', description: 'Tester avec un ID null', priority: 1, checked: false },
  { methodName: 'findById', testName: 'testFindById_WithNegativeId', type: 'boundary', description: 'Tester avec un ID négatif', priority: 2, checked: false },
  { methodName: 'findById', testName: 'testFindById_WithZeroId', type: 'boundary', description: 'Tester avec ID = 0', priority: 2, checked: false },
  { methodName: 'create', testName: 'testCreate_WithValidData', type: 'equivalence', description: 'Tester avec des données valides', priority: 1, checked: false },
  { methodName: 'create', testName: 'testCreate_WithNullName', type: 'null', description: 'Tester avec un nom null', priority: 1, checked: false },
  { methodName: 'create', testName: 'testCreate_WithInvalidEmail', type: 'exception', description: 'Tester avec un email invalide', priority: 1, checked: false },
  { methodName: 'delete', testName: 'testDelete_WithValidId', type: 'equivalence', description: 'Tester la suppression avec un ID valide', priority: 1, checked: false },
  { methodName: 'delete', testName: 'testDelete_WithNullId', type: 'null', description: 'Tester la suppression avec ID null', priority: 1, checked: false },
];

const mutationChecklist = [
  { id: 1, mutation: 'Conditionals Boundary', description: 'Modifier les conditions limites (< vs <=)', covered: true },
  { id: 2, mutation: 'Negate Conditionals', description: 'Inverser les conditions booléennes', covered: true },
  { id: 3, mutation: 'Remove Conditionals', description: 'Supprimer les conditions if', covered: false },
  { id: 4, mutation: 'Return Values', description: 'Modifier les valeurs de retour', covered: true },
  { id: 5, mutation: 'Void Method Calls', description: 'Supprimer les appels de méthodes void', covered: false },
  { id: 6, mutation: 'Constructor Calls', description: 'Modifier les appels de constructeur', covered: true },
  { id: 7, mutation: 'Argument Propagation', description: "Propager les arguments d'entrée", covered: false },
];

export default function TestGenerator() {
  const { toast } = useToast();
  const [javaCode, setJavaCode] = useState(defaultJavaCode);
  const [generatedTest, setGeneratedTest] = useState('');
  const [analysis, setAnalysis] = useState<ClassAnalysis | null>(null);
  const [suggestions, setSuggestions] = useState<TestSuggestion[]>([]);
  const [activeTab, setActiveTab] = useState('test');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setIsLoading(true);
    setLoadingAction('analyze');
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setAnalysis(mockAnalysis);
    setActiveTab('analysis');
    setIsLoading(false);
    setLoadingAction(null);
    toast({
      title: 'Analyse terminée',
      description: `Classe ${mockAnalysis.className} analysée avec succès`,
    });
  };

  const handleGenerateTest = async () => {
    setIsLoading(true);
    setLoadingAction('generate');
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setGeneratedTest(mockGeneratedTest);
    setActiveTab('test');
    setIsLoading(false);
    setLoadingAction(null);
    toast({
      title: 'Tests générés',
      description: 'Les tests unitaires ont été générés avec succès',
    });
  };

  const handleSuggestTests = async () => {
    setIsLoading(true);
    setLoadingAction('suggest');
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setSuggestions(mockSuggestions);
    setActiveTab('suggestions');
    setIsLoading(false);
    setLoadingAction(null);
    toast({
      title: 'Suggestions générées',
      description: `${mockSuggestions.length} cas de test suggérés`,
    });
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generatedTest);
    toast({
      title: 'Code copié',
      description: 'Le code a été copié dans le presse-papiers',
    });
  };

  const handleDownload = () => {
    const blob = new Blob([generatedTest], { type: 'text/java' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${analysis?.className || 'Test'}Test.java`;
    link.click();
    URL.revokeObjectURL(url);
    toast({
      title: 'Fichier téléchargé',
      description: `${analysis?.className || 'Test'}Test.java`,
    });
  };

  const toggleSuggestion = (index: number) => {
    setSuggestions((prev) =>
      prev.map((s, i) => (i === index ? { ...s, checked: !s.checked } : s))
    );
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'equivalence':
        return 'bg-primary/20 text-primary border-primary/30';
      case 'boundary':
        return 'bg-warning/20 text-warning border-warning/30';
      case 'null':
        return 'bg-destructive/20 text-destructive border-destructive/30';
      case 'exception':
        return 'bg-coverage-mutation/20 text-coverage-mutation border-coverage-mutation/30';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Générateur de Tests</h1>
        <p className="text-muted-foreground">
          Analysez votre code Java et générez des tests unitaires automatiquement
        </p>
      </div>

      {/* Main Content - Split View */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Panel - Code Editor */}
        <Card className="flex flex-col">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <FileCode className="h-4 w-4" />
                Code Source Java
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAnalyze}
                  disabled={isLoading}
                >
                  {loadingAction === 'analyze' ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Play className="mr-2 h-4 w-4" />
                  )}
                  Analyser
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSuggestTests}
                  disabled={isLoading}
                >
                  {loadingAction === 'suggest' ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Lightbulb className="mr-2 h-4 w-4" />
                  )}
                  Suggestions
                </Button>
                <Button size="sm" onClick={handleGenerateTest} disabled={isLoading}>
                  {loadingAction === 'generate' ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <FlaskConical className="mr-2 h-4 w-4" />
                  )}
                  Générer Tests
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1 p-0">
            <div className="h-[600px] border-t border-border">
              <Editor
                height="100%"
                defaultLanguage="java"
                value={javaCode}
                onChange={(value) => setJavaCode(value || '')}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 13,
                  fontFamily: "'JetBrains Mono', monospace",
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  padding: { top: 16 },
                }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Right Panel - Output Tabs */}
        <Card className="flex flex-col">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="flex items-center justify-between">
                  <TabsList>
                    <TabsTrigger value="test" className="flex items-center gap-2">
                      <FlaskConical className="h-4 w-4" />
                      Test Généré
                    </TabsTrigger>
                    <TabsTrigger value="analysis" className="flex items-center gap-2">
                      <FolderTree className="h-4 w-4" />
                      Analyse
                    </TabsTrigger>
                    <TabsTrigger value="suggestions" className="flex items-center gap-2">
                      <CheckSquare className="h-4 w-4" />
                      Suggestions
                    </TabsTrigger>
                    <TabsTrigger value="mutations" className="flex items-center gap-2">
                      <Bug className="h-4 w-4" />
                      Mutations
                    </TabsTrigger>
                  </TabsList>
                  {generatedTest && activeTab === 'test' && (
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={handleCopyCode}>
                        <Copy className="mr-2 h-4 w-4" />
                        Copier
                      </Button>
                      <Button variant="outline" size="sm" onClick={handleDownload}>
                        <Download className="mr-2 h-4 w-4" />
                        Télécharger
                      </Button>
                    </div>
                  )}
                </div>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent className="flex-1 p-0">
            <Tabs value={activeTab} className="h-full">
              <TabsContent value="test" className="h-[600px] m-0 border-t border-border">
                {generatedTest ? (
                  <Editor
                    height="100%"
                    defaultLanguage="java"
                    value={generatedTest}
                    theme="vs-dark"
                    options={{
                      minimap: { enabled: false },
                      fontSize: 13,
                      fontFamily: "'JetBrains Mono', monospace",
                      lineNumbers: 'on',
                      scrollBeyondLastLine: false,
                      automaticLayout: true,
                      readOnly: true,
                      padding: { top: 16 },
                    }}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <FlaskConical className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Cliquez sur "Générer Tests" pour créer les tests unitaires</p>
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="analysis" className="h-[600px] m-0 border-t border-border">
                <ScrollArea className="h-full p-4">
                  {analysis ? (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold">{analysis.className}</h3>
                        <p className="text-sm text-muted-foreground">{analysis.packageName}</p>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium mb-2">Constructeurs</h4>
                        <div className="space-y-2">
                          {analysis.constructors.map((ctor, i) => (
                            <div key={i} className="rounded-lg bg-muted/50 p-3 font-mono text-sm">
                              {analysis.className}(
                              {ctor.parameters.map((p) => `${p.type} ${p.name}`).join(', ')})
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium mb-2">Méthodes ({analysis.methods.length})</h4>
                        <div className="space-y-2">
                          {analysis.methods.map((method, i) => (
                            <div key={i} className="rounded-lg bg-muted/50 p-3">
                              <div className="font-mono text-sm">
                                <span className="text-primary">{method.returnType}</span>{' '}
                                <span className="font-semibold">{method.name}</span>(
                                {method.parameters.map((p) => `${p.type} ${p.name}`).join(', ')})
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium mb-2">Champs ({analysis.fields.length})</h4>
                        <div className="space-y-2">
                          {analysis.fields.map((field, i) => (
                            <div key={i} className="rounded-lg bg-muted/50 p-3 font-mono text-sm">
                              <span className="text-primary">{field.type}</span> {field.name}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                      <div className="text-center">
                        <FolderTree className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Cliquez sur "Analyser" pour voir la structure de la classe</p>
                      </div>
                    </div>
                  )}
                </ScrollArea>
              </TabsContent>

              <TabsContent value="suggestions" className="h-[600px] m-0 border-t border-border">
                <ScrollArea className="h-full p-4">
                  {suggestions.length > 0 ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                          {suggestions.filter((s) => s.checked).length} / {suggestions.length} sélectionnés
                        </p>
                        <Badge variant="outline" className="bg-success/20 text-success">
                          Couverture estimée: 90%
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        {suggestions.map((suggestion, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-3 rounded-lg border border-border p-3 hover:bg-muted/30 transition-colors"
                          >
                            <Checkbox
                              checked={suggestion.checked}
                              onCheckedChange={() => toggleSuggestion(index)}
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-mono text-sm font-medium">
                                  {suggestion.testName}
                                </span>
                                <Badge
                                  variant="outline"
                                  className={`text-xs ${getTypeColor(suggestion.type)}`}
                                >
                                  {suggestion.type}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {suggestion.description}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                Méthode: {suggestion.methodName} • Priorité: {suggestion.priority}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                      <div className="text-center">
                        <Lightbulb className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Cliquez sur "Suggestions" pour obtenir des cas de test</p>
                      </div>
                    </div>
                  )}
                </ScrollArea>
              </TabsContent>

              <TabsContent value="mutations" className="h-[600px] m-0 border-t border-border">
                <ScrollArea className="h-full p-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">
                        Checklist de mutations pour améliorer le score
                      </p>
                      <Badge variant="outline">
                        {mutationChecklist.filter((m) => m.covered).length} / {mutationChecklist.length} couverts
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      {mutationChecklist.map((mutation) => (
                        <div
                          key={mutation.id}
                          className={`flex items-start gap-3 rounded-lg border p-3 ${
                            mutation.covered
                              ? 'border-success/30 bg-success/5'
                              : 'border-border bg-muted/30'
                          }`}
                        >
                          <Checkbox checked={mutation.covered} disabled />
                          <div className="flex-1">
                            <p className="font-medium text-sm">{mutation.mutation}</p>
                            <p className="text-sm text-muted-foreground">{mutation.description}</p>
                          </div>
                          {mutation.covered ? (
                            <Badge className="bg-success/20 text-success border-success/30">
                              Couvert
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-muted-foreground">
                              À couvrir
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
