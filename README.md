# Курсовая работа к курсу «Продвинутый JavaScript». Retro Game

---
[![Build status](https://ci.appveyor.com/api/projects/status/plhw7nubgdf7959i?svg=true)](https://ci.appveyor.com/project/Liaksej/ajs-diplom)

### Запуск игры: https://liaksej.github.io/ajs-diplom/


## Концепция игры

Двухмерная игра в стиле фэнтези, где игроку предстоит выставлять своих персонажей против 
персонажей нечисти. После каждого раунда восстанавливается жизнь уцелевших персонажей 
игрока и повышается их уровень. Максимальный уровень - 4.

Игру можно сохранять и восстанавливать из сохранения.

## Файловая структура

Ключевые сущности:
1. GamePlay - класс, отвечающий за взаимодействие с HTML-страницей
2. GameController - класс, отвечающий за логику приложения
3. Character - базовый класс, от которого наследовуются персонажи
4. GameState - объект, который хранит текущее состояние игры (может сам себя воссоздавать из другого объекта)
5. GameStateService - объект, который взаимодействует с текущим состоянием (сохраняет данные в localStorage для последующей загрузки)
6. PositionedCharacter - Character, привязанный к координате на поле
7. Team - класс для команды (набор персонажей), представляющих компьютер и игрока
8. generators - модуль, содержащий вспомогательные функции для генерации команды и персонажей

## 1. Уровни в игре

В игре 4 уровня:
* Level 1: prairie
* Level 2: desert
* Level 3: arctic
* Level 4: mountain

## 2. Особенности персонажей

#### Пероснажи игрока

1. Bowman (Лучник)
2. Swordsman (Мечник)
3. Magician (Маг)

#### Персонажи соперника

4. Vampire (Вампир)
5. Undead (Восставший из мёртвых)
6. Daemon (Демон)

### Начальные характеристики персонажей

| Класс     | attack | defence |
|-----------|--------|---------|
| Bowman    | 25     | 25      |
| Swordsman | 40     | 10      |
| Magician  | 10     | 40      |
| Vampire   | 25     | 25      |
| Undead    | 40     | 10      |
| Daemon    | 10     | 10      |


## 3. Вывод информации о персонаже

При наведении курсора на персонажа появляется информация о нем.
![](https://i.imgur.com/SljJjE0.png)

## 4. Ход игрока

1. Если мы собираемся выбрать другого персонажа, то поле не подсвечивается, а курсор приобретает форму `pointer`:

    ![](https://i.imgur.com/yNI25eV.png)

2. Если мы собираемся перейти на другую клетку (в рамках допустимых переходов), то поле подсвечивается зелёным, курсор приобретает форму `pointer`:

    ![](https://i.imgur.com/Je5zqN0.png)

3. Если мы собираемся атаковать противника (в рамках допустимого радиуса атаки), то поле подсвечивается красным, курсор приобретает форму `crosshair`:

    ![](https://i.imgur.com/gUlSc6O.png)

4. Если мы собираемся выполнить недопустимое действие, то курсор приобретает форму `notallowed` (в этом случае при клике так же выводится сообщение об ошибке):

    ![](https://i.imgur.com/O8QsL40.png)

### Особенности атаки и движения персонажей

Направление движения аналогично ферзю в шахматах. 
Персонажи разного типа могут ходить на разное расстояние 
(в базовом варианте можно перескакивать через других персонажей, т.е. как конь в шахматах, 
единственное правило - ходим по прямым и по диагонали):

* Мечники/Скелеты - 4 клетки в любом направлении
* Лучники/Вампиры - 2 клетки в любом направлении
* Маги/Демоны - 1 клетка в любом направлении

![](https://i.imgur.com/yp8vjhL.jpg)

Дальность атаки тоже ограничена:
* Мечники/Скелеты - могут атаковать только соседнюю клетку
* Лучники/Вампиры - на ближайшие 2 клетки
* Маги/Демоны - на ближайшие 4 клетки

Клетки считаются "по радиусу", допустим для мечника зона поражения будет выглядеть вот так:

![](https://i.imgur.com/gJ8DXPU.jpg)

Для лучника(отмечено красным):

![](https://i.imgur.com/rIINaFD.png)

## 4. Атака

Пора заняться атакой. Реализуйте логику, связанную с атакой в `GameController`: 
для отображения урона используйте метод `showDamage` из `GamePlay`. 
Обратите внимание, что он возвращает `Promise` - добейтесь того, чтобы анимация урона доходила 
до конца. Обрат

## 5. Повышение уровня персонажа

1. При переходе на новый уровень показатель health приводится к значению: текущий уровень + 80 (но не более 100). 

    Т.е. если у персонажа 1 после окончания раунда уровень жизни был 10, а персонажа 2 - 80, то после levelup:
    - персонаж 1 - жизнь станет 90
    - персонаж 2 - жизнь станет 100

2. Повышение показателей атаки/защиты привязаны к оставшейся жизни по формуле: 

    `attackAfter = Math.max(attackBefore, attackBefore * (80 + life) / 100)`, т.е. если у персонажа после окончания раунда жизни осталось 50%, то его показатели улучшатся на 30%. Если  жизни осталось 1%, то показатели никак не увеличатся.

## 6. Game Over, New Game и статистика

После завершения игры (проигрыша игрока) или завершения всех 4 уровней игровое поле необходимо заблокировать (т.е. не реагировать на события, происходящие на нём).

При нажатии на кнопку `New Game`, стартует новая игра.

## 7. Хранение состояния игры

Состояние хранится в битном типе в `localstorage` и восстанавливается из него при загрузке.