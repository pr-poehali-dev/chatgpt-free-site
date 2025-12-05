import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type Message = {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

const programmingLanguages = [
  { value: 'lua', label: 'Lua', icon: '🌙' },
  { value: 'luau', label: 'LuaU', icon: '🔷' },
  { value: 'java', label: 'Java', icon: '☕' },
  { value: 'javascript', label: 'JavaScript', icon: '⚡' },
  { value: 'python', label: 'Python', icon: '🐍' },
  { value: 'cpp', label: 'C++', icon: '⚙️' },
  { value: 'csharp', label: 'C#', icon: '💠' },
  { value: 'roblox', label: 'Roblox Studio', icon: '🎮' },
];

const codeExamples = [
  {
    language: 'Python',
    title: 'Функция для сортировки списка',
    code: `def quick_sort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quick_sort(left) + middle + quick_sort(right)`
  },
  {
    language: 'JavaScript',
    title: 'Async/Await запрос к API',
    code: `async function fetchData(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
}`
  },
  {
    language: 'Lua',
    title: 'Roblox: Телепорт игрока',
    code: `local Players = game:GetService("Players")
local TeleportService = game:GetService("TeleportService")

local function teleportPlayer(player, placeId)
    TeleportService:Teleport(placeId, player)
end`
  }
];

export default function Index() {
  const [activeTab, setActiveTab] = useState('home');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Привет! Я AI-ассистент для программирования. Выберите язык программирования и задайте свой вопрос. Я помогу с кодом, объясню концепции и помогу решить задачи на Lua, Python, JavaScript, C++, C#, Java и Roblox Studio!',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('python');
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const responses: { [key: string]: string } = {
        lua: `Отличный вопрос о Lua! Lua - это легкий скриптовый язык, который отлично подходит для встраивания в приложения. 

Вот пример базовой структуры:
\`\`\`lua
local function greet(name)
    return "Привет, " .. name .. "!"
end

print(greet("Разработчик"))
\`\`\`

В Lua используется .. для конкатенации строк, а local создает локальные переменные.`,
        python: `Отлично! Python - мощный и читаемый язык программирования. 

Вот пример решения:
\`\`\`python
def calculate_sum(numbers):
    """Вычисляет сумму чисел в списке"""
    return sum(numbers)

result = calculate_sum([1, 2, 3, 4, 5])
print(f"Сумма: {result}")  # Вывод: Сумма: 15
\`\`\`

Используйте f-strings для форматирования и документируйте функции с помощью docstrings!`,
        javascript: `Отличный вопрос о JavaScript! 

Вот современное решение с использованием ES6+:
\`\`\`javascript
const processData = async (items) => {
  const results = items.map(item => ({
    ...item,
    processed: true
  }));
  
  return results.filter(r => r.active);
};
\`\`\`

Используйте стрелочные функции, деструктуризацию и async/await для чистого кода!`,
        roblox: `Отлично! В Roblox Studio используется Lua (LuaU). 

Вот пример создания простой части:
\`\`\`lua
local part = Instance.new("Part")
part.Parent = workspace
part.Position = Vector3.new(0, 10, 0)
part.Size = Vector3.new(4, 1, 2)
part.BrickColor = BrickColor.new("Bright red")
part.Anchored = true
\`\`\`

Используйте workspace для размещения объектов в игровом мире!`
      };

      const assistantMessage: Message = {
        role: 'assistant',
        content: responses[selectedLanguage] || `Отлично! Я помогу вам с ${selectedLanguage}. Это мощный язык программирования с широкими возможностями. Задавайте конкретные вопросы, и я предоставлю примеры кода и объяснения!`,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--chat-bg))] text-foreground">
      <header className="border-b border-[hsl(var(--border))] bg-[hsl(var(--card))] sticky top-0 z-50 backdrop-blur-sm bg-opacity-95">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-2xl">
              🤖
            </div>
            <div>
              <h1 className="text-xl font-bold">ChatGPT Free</h1>
              <p className="text-xs text-muted-foreground">AI Programming Assistant</p>
            </div>
          </div>
          <nav className="hidden md:flex gap-6">
            <Button 
              variant={activeTab === 'home' ? 'default' : 'ghost'} 
              onClick={() => setActiveTab('home')}
              className="gap-2"
            >
              <Icon name="Home" size={18} />
              Главная
            </Button>
            <Button 
              variant={activeTab === 'chat' ? 'default' : 'ghost'} 
              onClick={() => setActiveTab('chat')}
              className="gap-2"
            >
              <Icon name="MessageSquare" size={18} />
              Чат
            </Button>
            <Button 
              variant={activeTab === 'examples' ? 'default' : 'ghost'} 
              onClick={() => setActiveTab('examples')}
              className="gap-2"
            >
              <Icon name="Code" size={18} />
              Примеры
            </Button>
            <Button 
              variant={activeTab === 'about' ? 'default' : 'ghost'} 
              onClick={() => setActiveTab('about')}
              className="gap-2"
            >
              <Icon name="Info" size={18} />
              О проекте
            </Button>
            <Button 
              variant={activeTab === 'contact' ? 'default' : 'ghost'} 
              onClick={() => setActiveTab('contact')}
              className="gap-2"
            >
              <Icon name="Mail" size={18} />
              Контакты
            </Button>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {activeTab === 'home' && (
          <div className="max-w-6xl mx-auto space-y-12 animate-fade-in">
            <section className="text-center space-y-6 py-12">
              <div className="inline-block">
                <Badge className="mb-4 text-base px-4 py-2" variant="secondary">
                  Бесплатный AI ассистент
                </Badge>
              </div>
              <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Программирование стало проще
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Получайте мгновенные ответы на вопросы по программированию, примеры кода и решения задач на любом языке
              </p>
              <div className="flex gap-4 justify-center pt-4">
                <Button size="lg" className="gap-2" onClick={() => setActiveTab('chat')}>
                  <Icon name="Sparkles" size={20} />
                  Начать чат
                </Button>
                <Button size="lg" variant="outline" className="gap-2" onClick={() => setActiveTab('examples')}>
                  <Icon name="BookOpen" size={20} />
                  Примеры кода
                </Button>
              </div>
            </section>

            <section className="grid md:grid-cols-3 gap-6">
              <Card className="p-6 bg-[hsl(var(--card))] hover:shadow-lg transition-all hover:scale-105">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Icon name="Zap" size={24} className="text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Быстрые ответы</h3>
                <p className="text-muted-foreground">
                  Получайте мгновенные решения и объяснения для любых задач по программированию
                </p>
              </Card>

              <Card className="p-6 bg-[hsl(var(--card))] hover:shadow-lg transition-all hover:scale-105">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Icon name="Languages" size={24} className="text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">8+ языков</h3>
                <p className="text-muted-foreground">
                  Поддержка Python, JavaScript, Lua, C++, C#, Java и Roblox Studio
                </p>
              </Card>

              <Card className="p-6 bg-[hsl(var(--card))] hover:shadow-lg transition-all hover:scale-105">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Icon name="Gamepad2" size={24} className="text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Roblox Studio</h3>
                <p className="text-muted-foreground">
                  Специализация на разработке игр в Roblox Studio и скриптинге
                </p>
              </Card>
            </section>

            <section className="bg-[hsl(var(--card))] rounded-xl p-8">
              <h3 className="text-2xl font-bold mb-6 text-center">Поддерживаемые языки</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {programmingLanguages.map((lang) => (
                  <div 
                    key={lang.value}
                    className="flex items-center gap-3 p-4 rounded-lg bg-[hsl(var(--chat-message-bg))] hover:bg-[hsl(var(--chat-user-bg))] transition-colors cursor-pointer"
                  >
                    <span className="text-2xl">{lang.icon}</span>
                    <span className="font-medium">{lang.label}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="max-w-4xl mx-auto animate-fade-in">
            <Card className="bg-[hsl(var(--card))] overflow-hidden">
              <div className="p-4 border-b border-[hsl(var(--border))] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Icon name="MessageSquare" size={24} className="text-primary" />
                  <div>
                    <h3 className="font-semibold">AI Чат-ассистент</h3>
                    <p className="text-xs text-muted-foreground">Онлайн и готов помочь</p>
                  </div>
                </div>
                <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {programmingLanguages.map((lang) => (
                      <SelectItem key={lang.value} value={lang.value}>
                        {lang.icon} {lang.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <ScrollArea className="h-[500px] p-6">
                <div className="space-y-4">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex gap-3 animate-fade-in ${
                        message.role === 'user' ? 'flex-row-reverse' : ''
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.role === 'assistant' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-[hsl(var(--chat-user-bg))]'
                      }`}>
                        {message.role === 'assistant' ? '🤖' : '👤'}
                      </div>
                      <div
                        className={`rounded-2xl px-4 py-3 max-w-[80%] ${
                          message.role === 'assistant'
                            ? 'bg-[hsl(var(--chat-message-bg))]'
                            : 'bg-[hsl(var(--chat-user-bg))]'
                        }`}
                      >
                        <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                        <span className="text-xs text-muted-foreground mt-2 block">
                          {message.timestamp.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex gap-3 animate-fade-in">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                        🤖
                      </div>
                      <div className="bg-[hsl(var(--chat-message-bg))] rounded-2xl px-4 py-3">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                          <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                          <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              <div className="p-4 border-t border-[hsl(var(--border))]">
                <div className="flex gap-2">
                  <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder="Задайте вопрос по программированию..."
                    className="resize-none bg-[hsl(var(--chat-message-bg))] border-[hsl(var(--border))]"
                    rows={3}
                  />
                  <Button 
                    onClick={handleSendMessage} 
                    size="icon"
                    className="h-auto px-4"
                    disabled={!input.trim() || isTyping}
                  >
                    <Icon name="Send" size={20} />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'examples' && (
          <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
            <div className="text-center space-y-4 mb-8">
              <h2 className="text-3xl font-bold">Примеры кода</h2>
              <p className="text-muted-foreground">
                Готовые решения и паттерны для быстрого старта
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {codeExamples.map((example, index) => (
                <Card key={index} className="bg-[hsl(var(--card))] p-6 hover:shadow-lg transition-all">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="secondary">{example.language}</Badge>
                    <h3 className="font-semibold">{example.title}</h3>
                  </div>
                  <pre className="bg-[hsl(var(--chat-message-bg))] rounded-lg p-4 overflow-x-auto text-sm">
                    <code>{example.code}</code>
                  </pre>
                  <Button 
                    variant="ghost" 
                    className="w-full mt-4 gap-2"
                    onClick={() => {
                      navigator.clipboard.writeText(example.code);
                    }}
                  >
                    <Icon name="Copy" size={16} />
                    Копировать код
                  </Button>
                </Card>
              ))}
            </div>

            <Card className="bg-[hsl(var(--card))] p-8 text-center">
              <Icon name="Lightbulb" size={48} className="text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Нужен другой пример?</h3>
              <p className="text-muted-foreground mb-6">
                Перейдите в чат и попросите AI создать код под вашу задачу
              </p>
              <Button onClick={() => setActiveTab('chat')} className="gap-2">
                <Icon name="MessageSquare" size={18} />
                Открыть чат
              </Button>
            </Card>
          </div>
        )}

        {activeTab === 'about' && (
          <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center text-4xl mx-auto">
                🤖
              </div>
              <h2 className="text-4xl font-bold">О проекте ChatGPT Free</h2>
              <p className="text-xl text-muted-foreground">
                Бесплатный AI-ассистент для программистов всех уровней
              </p>
            </div>

            <Card className="bg-[hsl(var(--card))] p-8 space-y-6">
              <div>
                <h3 className="text-2xl font-bold mb-3 flex items-center gap-2">
                  <Icon name="Target" size={24} className="text-primary" />
                  Наша миссия
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Мы создали ChatGPT Free, чтобы сделать программирование доступнее. 
                  Наш AI-ассистент помогает разработчикам решать задачи быстрее, 
                  изучать новые языки и технологии, получать мгновенную помощь 24/7.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-bold mb-3 flex items-center gap-2">
                  <Icon name="Sparkles" size={24} className="text-primary" />
                  Возможности
                </h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex gap-2">
                    <Icon name="Check" size={20} className="text-primary mt-0.5" />
                    <span>Поддержка 8+ языков программирования включая Python, JavaScript, C++, Lua</span>
                  </li>
                  <li className="flex gap-2">
                    <Icon name="Check" size={20} className="text-primary mt-0.5" />
                    <span>Специализация на Roblox Studio и разработке игр</span>
                  </li>
                  <li className="flex gap-2">
                    <Icon name="Check" size={20} className="text-primary mt-0.5" />
                    <span>Мгновенные ответы и примеры кода</span>
                  </li>
                  <li className="flex gap-2">
                    <Icon name="Check" size={20} className="text-primary mt-0.5" />
                    <span>Объяснения сложных концепций простым языком</span>
                  </li>
                  <li className="flex gap-2">
                    <Icon name="Check" size={20} className="text-primary mt-0.5" />
                    <span>Помощь с отладкой и оптимизацией кода</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-2xl font-bold mb-3 flex items-center gap-2">
                  <Icon name="Rocket" size={24} className="text-primary" />
                  Технологии
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Наш ассистент использует передовые технологии искусственного интеллекта 
                  для понимания контекста и генерации точных решений. Мы постоянно улучшаем 
                  модель, добавляя новые возможности и языки программирования.
                </p>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
            <div className="text-center space-y-4">
              <Icon name="Mail" size={48} className="text-primary mx-auto" />
              <h2 className="text-4xl font-bold">Свяжитесь с нами</h2>
              <p className="text-xl text-muted-foreground">
                Есть вопросы или предложения? Мы всегда рады обратной связи!
              </p>
            </div>

            <Card className="bg-[hsl(var(--card))] p-8">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon name="Mail" size={24} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Email</h3>
                    <p className="text-muted-foreground">support@chatgptfree.dev</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon name="Github" size={24} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">GitHub</h3>
                    <p className="text-muted-foreground">github.com/chatgptfree</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon name="MessageCircle" size={24} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Discord</h3>
                    <p className="text-muted-foreground">discord.gg/chatgptfree</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon name="Twitter" size={24} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Twitter</h3>
                    <p className="text-muted-foreground">@chatgptfree</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-[hsl(var(--border))]">
                <h3 className="font-semibold text-lg mb-4">Или напишите нам прямо сейчас</h3>
                <Button 
                  className="w-full gap-2" 
                  size="lg"
                  onClick={() => setActiveTab('chat')}
                >
                  <Icon name="MessageSquare" size={20} />
                  Открыть чат с поддержкой
                </Button>
              </div>
            </Card>
          </div>
        )}
      </main>

      <footer className="border-t border-[hsl(var(--border))] bg-[hsl(var(--card))] mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-xl">
                🤖
              </div>
              <div className="text-sm text-muted-foreground">
                © 2024 ChatGPT Free. Все права защищены.
              </div>
            </div>
            <div className="flex gap-4">
              <Button variant="ghost" size="sm">Политика конфиденциальности</Button>
              <Button variant="ghost" size="sm">Условия использования</Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
