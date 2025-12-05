export const luaKnowledgeBase = {
  basics: {
    variables: `-- Переменные в Lua/LuaU
local name = "Player"
local health = 100
local isAlive = true
local position = nil

-- Глобальные переменные (избегайте их использования)
globalVar = "Доступна везде"

-- Множественное присваивание
local x, y, z = 10, 20, 30
local a, b = b, a -- Обмен значениями`,

    dataTypes: `-- Типы данных в Lua
local str = "Строка"          -- string
local num = 42                -- number
local float = 3.14            -- number
local bool = true             -- boolean
local empty = nil             -- nil
local tbl = {1, 2, 3}         -- table
local func = function() end   -- function

-- Проверка типа
print(type(str))   -- "string"
print(type(num))   -- "number"`,

    operators: `-- Операторы
-- Арифметические
local sum = 10 + 5
local diff = 10 - 5
local prod = 10 * 5
local quot = 10 / 5
local mod = 10 % 3
local pow = 2 ^ 3

-- Сравнение
local isEqual = (a == b)
local notEqual = (a ~= b)
local greater = (a > b)
local less = (a < b)

-- Логические
local andOp = true and false
local orOp = true or false
local notOp = not true

-- Конкатенация строк
local fullName = "John" .. " " .. "Doe"`
  },

  controlFlow: {
    ifElse: `-- Условные операторы
local health = 50

if health > 75 then
    print("Здоровье отличное")
elseif health > 50 then
    print("Здоровье хорошее")
elseif health > 25 then
    print("Здоровье среднее")
else
    print("Здоровье критическое")
end

-- Тернарный оператор (эмуляция)
local status = health > 50 and "Живой" or "Раненый"`,

    loops: `-- Циклы в Lua

-- Цикл for (числовой)
for i = 1, 10 do
    print(i)
end

-- Цикл for с шагом
for i = 10, 1, -1 do
    print(i)
end

-- Цикл for по таблице (массив)
local fruits = {"apple", "banana", "orange"}
for index, fruit in ipairs(fruits) do
    print(index, fruit)
end

-- Цикл for по таблице (словарь)
local player = {name = "Alex", level = 5}
for key, value in pairs(player) do
    print(key, value)
end

-- Цикл while
local count = 0
while count < 5 do
    print(count)
    count = count + 1
end

-- Цикл repeat-until
local num = 0
repeat
    num = num + 1
    print(num)
until num >= 5

-- Break и continue
for i = 1, 10 do
    if i == 5 then
        break  -- Выход из цикла
    end
    if i % 2 == 0 then
        continue  -- Только в LuaU!
    end
    print(i)
end`
  },

  functions: {
    basic: `-- Функции в Lua

-- Обычная функция
function greet(name)
    return "Привет, " .. name
end

-- Локальная функция
local function add(a, b)
    return a + b
end

-- Анонимная функция
local multiply = function(a, b)
    return a * b
end

-- Несколько возвращаемых значений
function getPosition()
    return 10, 20, 30
end
local x, y, z = getPosition()

-- Параметры по умолчанию
function createPlayer(name, health)
    health = health or 100
    return {name = name, health = health}
end

-- Вариативные функции
function sum(...)
    local args = {...}
    local total = 0
    for _, v in ipairs(args) do
        total = total + v
    end
    return total
end
print(sum(1, 2, 3, 4, 5))`,

    callbacks: `-- Callback функции
local function processData(data, callback)
    local result = data * 2
    callback(result)
end

processData(5, function(result)
    print("Результат:", result)
end)

-- Замыкания
function createCounter()
    local count = 0
    return function()
        count = count + 1
        return count
    end
end

local counter = createCounter()
print(counter())  -- 1
print(counter())  -- 2`
  },

  tables: {
    arrays: `-- Массивы (индексация с 1!)
local fruits = {"apple", "banana", "orange"}
print(fruits[1])  -- "apple"

-- Добавление элементов
table.insert(fruits, "grape")
table.insert(fruits, 2, "mango")

-- Удаление элементов
table.remove(fruits, 1)
table.remove(fruits)  -- Удаляет последний

-- Длина массива
print(#fruits)

-- Сортировка
table.sort(fruits)

-- Поиск элемента
table.find(fruits, "banana")  -- Только LuaU!`,

    dictionaries: `-- Словари (хеш-таблицы)
local player = {
    name = "Alex",
    health = 100,
    level = 5,
    inventory = {"sword", "shield"}
}

-- Доступ к значениям
print(player.name)
print(player["health"])

-- Добавление/изменение
player.score = 1000
player["health"] = 80

-- Удаление
player.score = nil

-- Проверка существования
if player.name then
    print("Имя существует")
end`,

    advanced: `-- Продвинутые операции с таблицами

-- Метатаблицы
local mt = {
    __add = function(a, b)
        return {x = a.x + b.x, y = a.y + b.y}
    end,
    __tostring = function(t)
        return "Vector(" .. t.x .. ", " .. t.y .. ")"
    end
}

local v1 = setmetatable({x = 10, y = 20}, mt)
local v2 = setmetatable({x = 5, y = 15}, mt)
local v3 = v1 + v2
print(v3)

-- Копирование таблиц
function deepCopy(orig)
    local copy
    if type(orig) == 'table' then
        copy = {}
        for k, v in pairs(orig) do
            copy[deepCopy(k)] = deepCopy(v)
        end
    else
        copy = orig
    end
    return copy
end`
  },

  roblox: {
    basics: `-- Основы Roblox Studio

-- Получение сервисов
local Players = game:GetService("Players")
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local Workspace = game:GetService("Workspace")
local RunService = game:GetService("RunService")

-- Локальный игрок (LocalScript)
local player = Players.LocalPlayer
local character = player.Character or player.CharacterAdded:Wait()
local humanoid = character:WaitForChild("Humanoid")
local rootPart = character:WaitForChild("HumanoidRootPart")

-- Создание объектов
local part = Instance.new("Part")
part.Size = Vector3.new(4, 1, 2)
part.Position = Vector3.new(0, 10, 0)
part.BrickColor = BrickColor.new("Bright red")
part.Material = Enum.Material.Neon
part.Anchored = true
part.Parent = workspace`,

    events: `-- События в Roblox

-- Подключение к событию
local part = workspace.Part
part.Touched:Connect(function(otherPart)
    local humanoid = otherPart.Parent:FindFirstChild("Humanoid")
    if humanoid then
        print("Игрок коснулся части!")
    end
end)

-- RemoteEvent (клиент → сервер)
local remoteEvent = ReplicatedStorage:WaitForChild("RemoteEvent")

-- Клиент отправляет
remoteEvent:FireServer("данные")

-- Сервер получает
remoteEvent.OnServerEvent:Connect(function(player, data)
    print(player.Name .. " отправил:", data)
end)

-- RemoteEvent (сервер → клиент)
remoteEvent:FireClient(player, "ответ")
remoteEvent:FireAllClients("всем")

-- Клиент получает
remoteEvent.OnClientEvent:Connect(function(data)
    print("Получено от сервера:", data)
end)`,

    movement: `-- Движение и телепортация

-- Телепортация игрока
local function teleportPlayer(character, position)
    local rootPart = character:FindFirstChild("HumanoidRootPart")
    if rootPart then
        rootPart.CFrame = CFrame.new(position)
    end
end

teleportPlayer(character, Vector3.new(0, 10, 0))

-- Движение с BodyVelocity
local bodyVel = Instance.new("BodyVelocity")
bodyVel.Velocity = Vector3.new(0, 50, 0)
bodyVel.MaxForce = Vector3.new(0, math.huge, 0)
bodyVel.Parent = rootPart
wait(1)
bodyVel:Destroy()

-- Изменение скорости ходьбы
humanoid.WalkSpeed = 32  -- По умолчанию 16

-- Прыжок
humanoid.Jump = true
humanoid.JumpPower = 100  -- По умолчанию 50`,

    datastore: `-- DataStore (сохранение данных)
local DataStoreService = game:GetService("DataStoreService")
local playerData = DataStoreService:GetDataStore("PlayerData")

-- Сохранение данных
local function saveData(player)
    local success, err = pcall(function()
        local data = {
            coins = player.leaderstats.Coins.Value,
            level = player.leaderstats.Level.Value
        }
        playerData:SetAsync(player.UserId, data)
    end)
    if not success then
        warn("Ошибка сохранения:", err)
    end
end

-- Загрузка данных
local function loadData(player)
    local success, data = pcall(function()
        return playerData:GetAsync(player.UserId)
    end)
    if success and data then
        return data
    else
        return {coins = 0, level = 1}
    end
end

-- Автосохранение при выходе
game.Players.PlayerRemoving:Connect(saveData)`,

    ui: `-- GUI в Roblox

-- Создание ScreenGui
local screenGui = Instance.new("ScreenGui")
screenGui.Parent = player.PlayerGui

-- Создание Frame
local frame = Instance.new("Frame")
frame.Size = UDim2.new(0, 200, 0, 100)
frame.Position = UDim2.new(0.5, -100, 0.5, -50)
frame.BackgroundColor3 = Color3.fromRGB(50, 50, 50)
frame.Parent = screenGui

-- Создание TextLabel
local label = Instance.new("TextLabel")
label.Size = UDim2.new(1, 0, 0, 50)
label.Text = "Привет, мир!"
label.TextColor3 = Color3.new(1, 1, 1)
label.BackgroundTransparency = 1
label.Parent = frame

-- Создание кнопки
local button = Instance.new("TextButton")
button.Size = UDim2.new(1, 0, 0, 40)
button.Position = UDim2.new(0, 0, 1, -40)
button.Text = "Нажми меня"
button.Parent = frame

button.MouseButton1Click:Connect(function()
    print("Кнопка нажата!")
    label.Text = "Кнопка была нажата!"
end)`,

    tween: `-- Анимация с TweenService
local TweenService = game:GetService("TweenService")

-- Анимация части
local part = workspace.Part
local tweenInfo = TweenInfo.new(
    2,                              -- Время (секунды)
    Enum.EasingStyle.Quad,          -- Стиль
    Enum.EasingDirection.Out,       -- Направление
    0,                              -- Повторы (-1 бесконечно)
    false,                          -- Реверс
    0                               -- Задержка
)

local goal = {Position = Vector3.new(0, 20, 0)}
local tween = TweenService:Create(part, tweenInfo, goal)
tween:Play()

-- События твина
tween.Completed:Connect(function()
    print("Анимация завершена!")
end)`,

    advanced: `-- Продвинутые техники

-- Raycasting
local function raycast(origin, direction, blacklist)
    local params = RaycastParams.new()
    params.FilterDescendantsInstances = blacklist
    params.FilterType = Enum.RaycastFilterType.Blacklist
    
    local result = workspace:Raycast(origin, direction, params)
    return result
end

-- Region3 (обнаружение объектов в области)
local region = Region3.new(
    Vector3.new(-10, 0, -10),
    Vector3.new(10, 20, 10)
)
region = region:ExpandToGrid(4)

local parts = workspace:FindPartsInRegion3(region, nil, 100)
for _, part in pairs(parts) do
    print(part.Name)
end

-- Magnitude (расстояние между точками)
local distance = (pos1 - pos2).Magnitude
if distance < 10 then
    print("Объекты близко!")
end

-- ContextActionService (управление вводом)
local ContextActionService = game:GetService("ContextActionService")

local function handleAction(actionName, inputState, inputObject)
    if inputState == Enum.UserInputState.Begin then
        print("Действие выполнено!")
    end
end

ContextActionService:BindAction(
    "MyAction",
    handleAction,
    false,
    Enum.KeyCode.E
)`
  },

  patterns: {
    oop: `-- ООП в Lua

-- Создание класса
local Player = {}
Player.__index = Player

function Player.new(name, health)
    local self = setmetatable({}, Player)
    self.name = name
    self.health = health or 100
    return self
end

function Player:takeDamage(amount)
    self.health = self.health - amount
    if self.health <= 0 then
        self:die()
    end
end

function Player:heal(amount)
    self.health = math.min(self.health + amount, 100)
end

function Player:die()
    print(self.name .. " погиб!")
end

-- Использование
local player = Player.new("Alex")
player:takeDamage(30)
player:heal(20)`,

    modules: `-- Модульная система (ModuleScript)

-- MyModule.lua (ModuleScript)
local MyModule = {}

function MyModule.sayHello(name)
    return "Привет, " .. name
end

function MyModule.calculate(a, b)
    return a + b
end

return MyModule

-- Использование модуля
local MyModule = require(ReplicatedStorage.MyModule)
print(MyModule.sayHello("Alex"))
print(MyModule.calculate(10, 20))`,

    stateManagement: `-- Управление состоянием
local GameState = {
    _currentState = "menu",
    _states = {}
}

function GameState:registerState(name, callbacks)
    self._states[name] = callbacks
end

function GameState:changeState(newState)
    if self._states[self._currentState].onExit then
        self._states[self._currentState].onExit()
    end
    
    self._currentState = newState
    
    if self._states[newState].onEnter then
        self._states[newState].onEnter()
    end
end

-- Регистрация состояний
GameState:registerState("menu", {
    onEnter = function()
        print("Вход в меню")
    end,
    onExit = function()
        print("Выход из меню")
    end
})

GameState:registerState("playing", {
    onEnter = function()
        print("Начало игры")
    end
})`
  },

  optimization: {
    performance: `-- Оптимизация производительности

-- 1. Кэширование ссылок
local workspace = game:GetService("Workspace")
local part = workspace.Part  -- Кэшируем ссылку

-- 2. Локальные переменные быстрее глобальных
local math_random = math.random
for i = 1, 1000 do
    local num = math_random(1, 100)
end

-- 3. Используйте таблицы для множественных условий
local validStates = {
    playing = true,
    paused = true,
    loading = true
}
if validStates[currentState] then
    -- Быстрее чем if state == "playing" or state == "paused"...
end

-- 4. Избегайте pairs() для массивов, используйте ipairs()
for i, v in ipairs(array) do  -- Быстрее
    -- код
end

-- 5. Переиспользуйте объекты вместо создания новых
local objectPool = {}
function getObject()
    return table.remove(objectPool) or Instance.new("Part")
end

function returnObject(obj)
    table.insert(objectPool, obj)
end`,

    memory: `-- Управление памятью

-- 1. Очищайте соединения
local connection = part.Touched:Connect(function() end)
-- Когда не нужно:
connection:Disconnect()

-- 2. Уничтожайте неиспользуемые объекты
local part = Instance.new("Part")
part.Parent = workspace
-- Когда не нужно:
part:Destroy()

-- 3. Используйте weak tables для кэша
local cache = {}
setmetatable(cache, {__mode = "v"})  -- Слабые значения

-- 4. Избегайте утечек памяти в циклах
while wait() do
    local data = {}  -- Создается каждую итерацию
    -- Используйте локальные переменные
end`
  },

  debugging: {
    basic: `-- Отладка в Lua

-- Печать значений
print("Значение:", value)
warn("Предупреждение!")
error("Критическая ошибка!")

-- Проверка типов
assert(type(value) == "number", "Должно быть число!")

-- pcall (защищенный вызов)
local success, result = pcall(function()
    return riskyFunction()
end)

if success then
    print("Успех:", result)
else
    warn("Ошибка:", result)
end

-- xpcall (с обработчиком ошибок)
local function errorHandler(err)
    warn("Перехвачена ошибка:", err)
    warn(debug.traceback())
end

xpcall(riskyFunction, errorHandler)`,

    advanced: `-- Продвинутая отладка

-- Debug библиотека
print(debug.traceback())  -- Стек вызовов

-- Информация о функции
local info = debug.getinfo(myFunction)
print("Имя:", info.name)
print("Строка:", info.currentline)

-- Профилирование времени
local startTime = tick()
-- код для измерения
local endTime = tick()
print("Время выполнения:", endTime - startTime)

-- В Roblox Studio
local startClock = os.clock()
-- код
print("Прошло секунд:", os.clock() - startClock)`
  }
};

export const getLuaResponse = (userInput: string, language: string): string => {
  const input = userInput.toLowerCase();
  
  if (language === 'lua' || language === 'luau' || language === 'roblox') {
    if (input.includes('переменн') || input.includes('variable')) {
      return \`📝 **Переменные в Lua/LuaU**

\${luaKnowledgeBase.basics.variables}

💡 **Советы:**
- Всегда используйте \`local\` для локальных переменных
- Глобальные переменные могут вызывать конфликты
- В LuaU есть улучшенная типизация: \`local name: string = "Player"\`\`;
    }

    if (input.includes('цикл') || input.includes('loop') || input.includes('for')) {
      return \`🔄 **Циклы в Lua/LuaU**

\${luaKnowledgeBase.controlFlow.loops}

💡 **Важно:**
- В Lua индексация начинается с 1, не с 0!
- \`continue\` работает только в LuaU (Roblox)
- Используйте \`ipairs\` для массивов, \`pairs\` для словарей\`;
    }

    if (input.includes('функц') || input.includes('function')) {
      return \`⚡ **Функции в Lua/LuaU**

\${luaKnowledgeBase.functions.basic}

💡 **Продвинутое:**
\${luaKnowledgeBase.functions.callbacks}\`;
    }

    if (input.includes('таблиц') || input.includes('table') || input.includes('массив') || input.includes('array')) {
      return \`📦 **Таблицы в Lua/LuaU**

**Массивы:**
\${luaKnowledgeBase.tables.arrays}

**Словари:**
\${luaKnowledgeBase.tables.dictionaries}

💡 **Важно:** Индексация с 1, не с 0!\`;
    }

    if (input.includes('roblox') || input.includes('роблокс')) {
      if (input.includes('событ') || input.includes('event') || input.includes('remote')) {
        return \`🔗 **События в Roblox**

\${luaKnowledgeBase.roblox.events}

⚠️ **Безопасность:**
- Всегда проверяйте данные от клиента на сервере
- Не доверяйте клиентским данным
- Используйте RemoteFunction для возврата значений\`;
      }

      if (input.includes('движ') || input.includes('телепорт') || input.includes('movement')) {
        return \`🏃 **Движение в Roblox**

\${luaKnowledgeBase.roblox.movement}

💡 **Советы:**
- Используйте CFrame вместо Position для точного позиционирования
- BodyVelocity устарел, используйте BodyForce или VectorForce\`;
      }

      if (input.includes('datastore') || input.includes('дата') || input.includes('сохран')) {
        return \`💾 **DataStore в Roblox**

\${luaKnowledgeBase.roblox.datastore}

⚠️ **Лимиты:**
- 60 запросов в минуту на игрока
- Используйте UpdateAsync для безопасного обновления
- Всегда оборачивайте в pcall!\`;
      }

      if (input.includes('gui') || input.includes('ui') || input.includes('интерфейс')) {
        return \`🎨 **GUI в Roblox**

\${luaKnowledgeBase.roblox.ui}

💡 **UDim2:**
- UDim2.new(scaleX, offsetX, scaleY, offsetY)
- Scale = относительно родителя (0-1)
- Offset = пиксели\`;
      }

      return \`🎮 **Roblox Studio - Основы**

\${luaKnowledgeBase.roblox.basics}

📚 **Популярные темы:**
- События и RemoteEvent
- Движение и телепортация
- DataStore (сохранение)
- GUI системы
- Анимация (TweenService)

Спроси конкретнее о любой теме!\`;
    }

    if (input.includes('оптимиз') || input.includes('производ') || input.includes('performance')) {
      return \`⚡ **Оптимизация Lua/LuaU**

\${luaKnowledgeBase.optimization.performance}

**Управление памятью:**
\${luaKnowledgeBase.optimization.memory}

💡 **Главные правила:**
1. Кэшируйте часто используемые ссылки
2. Используйте локальные переменные
3. Отключайте неиспользуемые соединения
4. Уничтожайте объекты когда они не нужны\`;
    }

    if (input.includes('ооп') || input.includes('класс') || input.includes('oop') || input.includes('class')) {
      return \`🏗️ **ООП в Lua**

\${luaKnowledgeBase.patterns.oop}

**Модули:**
\${luaKnowledgeBase.patterns.modules}

💡 **Совет:** Используйте ModuleScript в Roblox для организации кода\`;
    }
  }

  return null;
};
