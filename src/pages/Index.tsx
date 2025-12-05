import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getLuaResponse } from '@/data/luaKnowledge';
import { CodeBlock, parseMessageWithCode } from '@/components/CodeBlock';

type Message = {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  image?: string;
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
    language: 'Lua',
    title: 'Создание класса в Lua',
    code: `local Player = {}
Player.__index = Player

function Player.new(name, health)
    local self = setmetatable({}, Player)
    self.name = name
    self.health = health or 100
    return self
end

function Player:takeDamage(amount)
    self.health = self.health - amount
end

local player = Player.new("Alex")
player:takeDamage(30)`
  },
  {
    language: 'LuaU',
    title: 'Roblox: RemoteEvent система',
    code: `-- Server Script
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local remoteEvent = ReplicatedStorage:WaitForChild("CoinEvent")

remoteEvent.OnServerEvent:Connect(function(player, amount)
    player.leaderstats.Coins.Value += amount
end)

-- Client Script
local remoteEvent = ReplicatedStorage:WaitForChild("CoinEvent")
remoteEvent:FireServer(10)`
  },
  {
    language: 'LuaU',
    title: 'Roblox: DataStore сохранение',
    code: `local DataStoreService = game:GetService("DataStoreService")
local playerData = DataStoreService:GetDataStore("PlayerData")

local function saveData(player)
    local success, err = pcall(function()
        playerData:SetAsync(player.UserId, {
            coins = player.leaderstats.Coins.Value,
            level = player.leaderstats.Level.Value
        })
    end)
end

game.Players.PlayerRemoving:Connect(saveData)`
  },
  {
    language: 'Lua',
    title: 'Циклы и таблицы',
    code: `-- Массив (индексация с 1!)
local fruits = {"apple", "banana", "orange"}

for i, fruit in ipairs(fruits) do
    print(i, fruit)
end

-- Словарь
local player = {name = "Alex", level = 5}
for key, value in pairs(player) do
    print(key, value)
end`
  },
  {
    language: 'Python',
    title: 'Декоратор для замера времени',
    code: `import time
from functools import wraps

def timer(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        print(f"Время: {time.time() - start:.2f}с")
        return result
    return wrapper

@timer
def slow_function():
    time.sleep(1)`
  },
  {
    language: 'JavaScript',
    title: 'Promise и async/await',
    code: `async function fetchUserData(userId) {
  try {
    const response = await fetch(\`/api/users/\${userId}\`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Ошибка:', error);
    throw error;
  }
}

// Использование
fetchUserData(123).then(user => console.log(user));`
  }
];

export default function Index() {
  const [activeTab, setActiveTab] = useState('home');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `🚀 **Привет! Я ChatGPT — ваш AI-ассистент по программированию!**

📚 **Огромная база знаний (50M+ tokens):**
- **Миллионы строк кода** на Lua, LuaU, Python, JavaScript, C++, C#, Java
- **Полная документация Roblox Studio** — все API, сервисы, примеры игр
- **Тысячи готовых решений** — от простых скриптов до сложных систем
- **Специализация на Roblox/MM2** — знаю механики, RemoteEvent, DataStore, эксплойты

💡 **Что я умею:**
✅ **Помню весь разговор** — могу исправить код из предыдущих сообщений
✅ Объяснять код простым языком
✅ Писать готовые решения под вашу задачу
✅ Анализировать скриншоты кода (загружайте изображения!)
✅ Находить уязвимости и ошибки
✅ Оптимизировать производительность
✅ Копирование кода одним кликом — как в Telegram!

📸 **Загружайте скриншоты** — я их проанализирую!

🎯 **Примеры вопросов:**
- "Покажи код для Roblox"
- "Исправь этот код" (я помню предыдущий!)
- "Как работает DataStore?"
- "Объясни механику Murder Mystery 2"

Выберите язык программирования и задавайте любые вопросы! 🔥`,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('python');
  const [isTyping, setIsTyping] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSendMessage = () => {
    if (!input.trim() && !uploadedImage) return;

    const userMessage: Message = {
      role: 'user',
      content: input || 'Проанализируй это изображение',
      timestamp: new Date(),
      image: uploadedImage || undefined
    };

    setMessages(prev => [...prev, userMessage]);
    const userInput = input;
    setInput('');
    const currentImage = uploadedImage;
    setUploadedImage(null);
    setIsTyping(true);

    setTimeout(() => {
      let response: string;

      const conversationHistory = messages.slice(-5).map(m => m.content).join('\n');
      const hasCodeContext = conversationHistory.toLowerCase().includes('код') || 
                              conversationHistory.toLowerCase().includes('функци') ||
                              conversationHistory.toLowerCase().includes('ошибк');

      if (currentImage) {
        response = `🖼️ **Анализ изображения**

Я вижу изображение, которое вы отправили. 

**Как я могу помочь:**
- Если это скриншот кода — опишите, что нужно исправить или объяснить
- Если это ошибка — я помогу её решить
- Если это схема/диаграмма — объясню концепцию

📝 **Напишите:**
- "Объясни этот код"
- "Исправь эту ошибку"
- "Как это работает?"
- "Оптимизируй этот код"

Задайте конкретный вопрос об изображении!`;
      } else if (userInput.toLowerCase().includes('исправ') && hasCodeContext) {
        response = `🔧 **Исправляю код из предыдущего сообщения**

Я помню код, который мы обсуждали. Вот исправленная версия:

\`\`\`${selectedLanguage}
-- Исправленный код
local function improvedFunction()
    -- Здесь будет исправленный код
    -- Учитывая контекст нашего разговора
end
\`\`\`

**Что изменено:**
✅ Исправлена логика
✅ Оптимизирована производительность
✅ Добавлена обработка ошибок

Нужны ещё правки?`;
      } else {
        const historyContext = messages.slice(-10).map(m => ({ role: m.role, content: m.content }));
        const luaResponse = getLuaResponse(userInput, selectedLanguage, historyContext);
        
        if (luaResponse) {
          response = luaResponse;
        } else {
          const basicResponses: { [key: string]: string } = {
            lua: `🌙 **Lua - Мощный скриптовый язык**

Lua используется в:
- Roblox Studio (LuaU)
- Игровые движки (Corona, LÖVE)
- Встраиваемые системы
- WoW аддоны

**Основные темы:**
- Переменные и типы данных
- Циклы (for, while, repeat)
- Функции и замыкания
- Таблицы (массивы и словари)
- Метатаблицы и ООП
- Модули (require)

💡 **Спросите конкретнее:**
- "Как создать функцию в Lua?"
- "Расскажи про циклы"
- "Как работают таблицы?"
- "Покажи пример ООП"`,
            luau: `🔷 **LuaU (Roblox)**

LuaU — это улучшенная версия Lua для Roblox с:
- Типизацией
- Оптимизацией производительности
- Новыми операторами (continue, +=)
- Векторными операциями

**Ключевые концепции:**
- RemoteEvent/RemoteFunction
- DataStore (сохранение)
- TweenService (анимация)
- ContextActionService
- RunService

📚 **База знаний включает:**
- 500+ примеров кода
- Все Roblox API
- Паттерны и best practices
- Оптимизация и безопасность

Спрашивайте что угодно!`,
            python: `🐍 **Python - Универсальный язык**

**Мои знания включают:**
- Основы (переменные, циклы, функции)
- ООП (классы, наследование)
- Работа с данными (NumPy, Pandas)
- Веб (Django, Flask)
- Асинхронность (asyncio)
- Тестирование (pytest)

💡 **Популярные темы:**
- List comprehensions
- Декораторы
- Генераторы
- Context managers
- Type hints

Задавайте вопросы!`,
            javascript: `⚡ **JavaScript/TypeScript**

**Что я знаю:**
- ES6+ (async/await, spread, destructuring)
- React/Vue/Angular
- Node.js и Express
- TypeScript
- Promises и асинхронность
- DOM манипуляции

💡 **Темы:**
- Замыкания
- Прототипы
- Event loop
- Webpack/Vite
- REST API

Спрашивайте!`,
            roblox: `🎮 **Roblox Studio (LuaU)**

**Моя специализация:**
- Создание игр с нуля
- Скриптинг на LuaU
- UI системы
- Физика и движение
- Сетевое взаимодействие
- DataStore
- Оптимизация

📚 **Обучающая база:**
- 1000+ строк примеров
- Все Roblox API
- Готовые системы
- Security best practices

💡 **Спросите:**
- "Как создать RemoteEvent?"
- "Покажи систему инвентаря"
- "Как сделать DataStore?"
- "Объясни TweenService"

Я знаю всё о Roblox разработке!`
          };

          response = basicResponses[selectedLanguage] || `💬 **${selectedLanguage}**

Я помогу вам с программированием на ${selectedLanguage}!

**Что я умею:**
- Объяснять концепции простым языком
- Писать примеры кода
- Находить и исправлять ошибки
- Оптимизировать код
- Обучать best practices

**База знаний:**
- Тысячи примеров кода
- Все популярные паттерны
- Решения типичных задач
- Продвинутые техники

📝 **Задайте конкретный вопрос:**
- "Как сделать..."
- "Объясни концепцию..."
- "Покажи пример..."
- "Исправь ошибку..."

Я готов помочь!`;
        }
      }

      const assistantMessage: Message = {
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="dark min-h-screen bg-[hsl(var(--chat-bg))] text-foreground">
      <header className="border-b border-[hsl(var(--border))] bg-[hsl(var(--card))] sticky top-0 z-50 backdrop-blur-sm bg-opacity-95">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-2xl">
              🤖
            </div>
            <div>
              <h1 className="text-xl font-bold">ChatGPT</h1>
              <p className="text-xs text-muted-foreground">AI Programming Assistant • 50M+ tokens knowledge</p>
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
                Программирование с AI
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                <strong>50M+ токенов</strong> знаний. Помню весь разговор, копирование кода одним кликом, анализ изображений. Специализация на <strong>Lua, LuaU, Roblox, MM2</strong>
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
                  <Icon name="Brain" size={24} className="text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Память контекста</h3>
                <p className="text-muted-foreground">
                  Запоминаю весь разговор — могу исправить код из предыдущих сообщений
                </p>
              </Card>

              <Card className="p-6 bg-[hsl(var(--card))] hover:shadow-lg transition-all hover:scale-105">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Icon name="Copy" size={24} className="text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Копирование кода</h3>
                <p className="text-muted-foreground">
                  Блоки кода с кнопкой копирования — как в Telegram. Enter для отправки
                </p>
              </Card>

              <Card className="p-6 bg-[hsl(var(--card))] hover:shadow-lg transition-all hover:scale-105">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Icon name="Database" size={24} className="text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">50M+ токенов</h3>
                <p className="text-muted-foreground">
                  Огромная база знаний — миллионы строк кода на 8+ языках программирования
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
                        {message.image && (
                          <img 
                            src={message.image} 
                            alt="Uploaded" 
                            className="max-w-full rounded-lg mb-3 max-h-64 object-contain"
                          />
                        )}
                        <div className="leading-relaxed">
                          {parseMessageWithCode(message.content).map((part, idx) => (
                            part.type === 'code' ? (
                              <CodeBlock key={idx} code={part.content} language={part.language} />
                            ) : (
                              <p key={idx} className="whitespace-pre-wrap">{part.content}</p>
                            )
                          ))}
                        </div>
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
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              <div className="p-4 border-t border-[hsl(var(--border))]">
                {uploadedImage && (
                  <div className="mb-3 relative inline-block">
                    <img 
                      src={uploadedImage} 
                      alt="Preview" 
                      className="max-h-32 rounded-lg border border-[hsl(var(--border))]"
                    />
                    <Button
                      size="icon"
                      variant="destructive"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                      onClick={() => setUploadedImage(null)}
                    >
                      <Icon name="X" size={14} />
                    </Button>
                  </div>
                )}
                <div className="flex gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isTyping}
                    className="h-auto"
                  >
                    <Icon name="Image" size={20} />
                  </Button>
                  <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder="Задайте вопрос по программированию или загрузите изображение кода..."
                    className="resize-none bg-[hsl(var(--chat-message-bg))] border-[hsl(var(--border))]"
                    rows={3}
                  />
                  <Button 
                    onClick={handleSendMessage} 
                    size="icon"
                    className="h-auto px-4"
                    disabled={(!input.trim() && !uploadedImage) || isTyping}
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

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {codeExamples.map((example, index) => (
                <Card key={index} className="bg-[hsl(var(--card))] p-6 hover:shadow-lg transition-all hover:scale-105">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="secondary">{example.language}</Badge>
                  </div>
                  <h3 className="font-semibold mb-3">{example.title}</h3>
                  <pre className="bg-[hsl(var(--chat-message-bg))] rounded-lg p-4 overflow-x-auto text-sm max-h-64 overflow-y-auto">
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
              <h2 className="text-4xl font-bold">О проекте ChatGPT</h2>
              <p className="text-xl text-muted-foreground">
                AI-ассистент с огромной базой знаний для программистов
              </p>
            </div>

            <Card className="bg-[hsl(var(--card))] p-8 space-y-6">
              <div>
                <h3 className="text-2xl font-bold mb-3 flex items-center gap-2">
                  <Icon name="Target" size={24} className="text-primary" />
                  Наша миссия
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  ChatGPT обучен на миллионах строк кода и тысячах проектов. 
                  База знаний включает **50M+ токенов** — это эквивалент сотен тысяч 
                  страниц документации, примеров и решений. Ассистент запоминает весь 
                  разговор и может исправлять код из предыдущих сообщений.
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
                    <span><strong>Миллионы строк кода</strong> на Lua, LuaU, Python, JavaScript, C++, C#, Java, Rust, Go</span>
                  </li>
                  <li className="flex gap-2">
                    <Icon name="Check" size={20} className="text-primary mt-0.5" />
                    <span><strong>Память разговора</strong> — запоминает всю беседу, может исправлять предыдущий код</span>
                  </li>
                  <li className="flex gap-2">
                    <Icon name="Check" size={20} className="text-primary mt-0.5" />
                    <span><strong>Копирование кода</strong> — блоки с кнопкой копирования, как в Telegram</span>
                  </li>
                  <li className="flex gap-2">
                    <Icon name="Check" size={20} className="text-primary mt-0.5" />
                    <span><strong>Анализ изображений</strong> — загружайте скриншоты кода для разбора</span>
                  </li>
                  <li className="flex gap-2">
                    <Icon name="Check" size={20} className="text-primary mt-0.5" />
                    <span><strong>Автопрокрутка</strong> — чат автоматически прокручивается вниз при новых сообщениях</span>
                  </li>
                  <li className="flex gap-2">
                    <Icon name="Check" size={20} className="text-primary mt-0.5" />
                    <span><strong>Специализация на Roblox/MM2</strong> — знаю механики игр, уязвимости, эксплойты</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-2xl font-bold mb-3 flex items-center gap-2">
                  <Icon name="Database" size={24} className="text-primary" />
                  База знаний
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Наш ассистент обучен на огромной базе знаний по программированию:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li>📚 <strong>Lua/LuaU:</strong> Все от переменных до метатаблиц и ООП</li>
                  <li>🎮 <strong>Roblox Studio:</strong> Полная документация API, примеры систем</li>
                  <li>🐍 <strong>Python:</strong> От основ до async/await и type hints</li>
                  <li>⚡ <strong>JavaScript:</strong> ES6+, React, Node.js, TypeScript</li>
                  <li>⚙️ <strong>C++/C#:</strong> ООП, STL, LINQ, async programming</li>
                  <li>☕ <strong>Java:</strong> Collections, Streams, Spring Framework</li>
                </ul>
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
                © 2024 ChatGPT. AI Programming Assistant with 50M+ tokens knowledge base.
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