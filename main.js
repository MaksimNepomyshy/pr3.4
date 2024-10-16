const $btnKick = document.getElementById('btn-kick');
const $btnSpecial = document.getElementById('btn-special');
const $enemiesContainer = document.querySelector('.enemies');
const $logs = document.getElementById('logs');

const character = {
    name: 'Pikachu',
    defaultHP: 100,
    damageHP: 100,
    elHP: document.getElementById('health-character'),
    elProgressbar: document.getElementById('progressbar-character'),


    renderHP() {
        this.renderHPLife();
        this.renderProgressbarHP();
    },

    renderHPLife() {
        this.elHP.innerText = `${this.damageHP} / ${this.defaultHP}`;
    },

    renderProgressbarHP() {
        const healthPercent = (this.damageHP / this.defaultHP) * 100;
        this.elProgressbar.style.width = `${healthPercent}%`;
        updateProgressbarColor(this.elProgressbar, healthPercent);
    },


    changeHP(count) {
        this.damageHP = Math.max(this.damageHP - count, 0);

        if (this.damageHP === 0) {
            alert('You Lost!');
            disableButtons();
        }

        this.renderHP();
    },
};

function Enemy(id, name, defaultHP) {
    this.id = id;
    this.name = name;
    this.defaultHP = defaultHP;
    this.damageHP = defaultHP;
    this.elHP = document.getElementById(`health-enemy-${id}`);
    this.elProgressbar = document.getElementById(`progressbar-enemy-${id}`);
}

Enemy.prototype.renderHP = function () {
    this.renderHPLife();
    this.renderProgressbarHP();
};

Enemy.prototype.renderHPLife = function () {
    this.elHP.innerText = `${this.damageHP} / ${this.defaultHP}`;
};

Enemy.prototype.renderProgressbarHP = function () {
    const healthPercent = (this.damageHP / this.defaultHP) * 100;
    this.elProgressbar.style.width = `${healthPercent}%`;
    updateProgressbarColor(this.elProgressbar, healthPercent);
};

Enemy.prototype.changeHP = function (count) {
    this.damageHP = Math.max(this.damageHP - count, 0);

    if (this.damageHP === 0) {
        alert(`${this.name} fainted!`);
        nextEnemy();
    }

    this.renderHP();
};

const enemies = [
    new Enemy(1, 'Charmander', 100),
    new Enemy(2, 'Squirtle', 100),
];

let currentEnemyIndex = 0;
let currentEnemy = enemies[currentEnemyIndex];

const attack = (target, attackType) => {
    const { damageHP: targetHP } = target;
    const { damageHP: characterHP } = character;

    let damage = random(20);

    if (attackType === 'special') {
        damage = Math.ceil(damage * 1.5);
    }

    target.changeHP(damage);

    if (targetHP > 0) {
        setTimeout(() => {
            const enemyDamage = random(15);
            character.changeHP(enemyDamage);

            createLog({
                target: character,
                damage: enemyDamage,
                hp: characterHP - enemyDamage,
            });
        }, 1000);
    }

    createLog({
        target,
        damage,
        hp: targetHP - damage,
    });
};

const createLog = ({ target, damage, hp }) => {
    const log = document.createElement('p');
    log.innerText = `
    ${character.name} нанёс ${target.name} ${damage} урона.
    ${target.name}: ${hp} HP
  `;

    $logs.prepend(log);
};

// Функція для створення лічильника з обмеженням і відображенням кількості
function createCounter(maxClicks, button) {
  let count = 0;
  const clicksLeftSpan = document.createElement("span"); 
  clicksLeftSpan.textContent = ` (${maxClicks} left)`; 
  button.appendChild(clicksLeftSpan); 
  
  return function() {
    if (count < maxClicks) {
      count++;
      console.log(`Кнопка "${button.textContent.trim()}" натиснута ${count} раз`);
      clicksLeftSpan.textContent = ` (${maxClicks - count} left)`;
      
      if (count === maxClicks) {
        console.log(`Кнопка "${button.textContent.trim()}" більше не активна`);
        button.disabled = true;
      }
      return true; // Повертаємо true, якщо клік дозволено
    }
    return false; // Повертаємо false, якщо клік не дозволено
  };
}

// Створюємо лічильники для кожної кнопки
const kickCounter = createCounter(6, $btnKick);
const specialCounter = createCounter(8, $btnSpecial); 

// Вішаємо обробники подій на кнопки
$btnKick.addEventListener('click', () => {
  if (kickCounter()) { // Викликаємо attack, тільки якщо лічильник дозволяє
    attack(currentEnemy, 'kick'); 
  }
});

$btnSpecial.addEventListener('click', () => {
  if (specialCounter()) { // Викликаємо attack, тільки якщо лічильник дозволяє
    attack(currentEnemy, 'special'); 
  }
});

const nextEnemy = () => {
    currentEnemyIndex = (currentEnemyIndex + 1) % enemies.length;
    currentEnemy = enemies[currentEnemyIndex];

    if (currentEnemy.damageHP === 0) {
        alert('You Win!');
        disableButtons();
    }
};

const disableButtons = () => {
    $btnKick.disabled = true;
    $btnSpecial.disabled = true;
};

const random = (num) => Math.ceil(Math.random() * num);

const init = () => {
    console.log('Start Game!');
    character.renderHP();
    enemies.forEach(enemy => enemy.renderHP());
};

function updateProgressbarColor(progressbar, healthPercent) {
    if (healthPercent > 70) {
        progressbar.style.background = 'linear-gradient(to right, lime, #8bf500)';
    } else if (healthPercent > 30) {
        progressbar.style.background = 'linear-gradient(to right, #ffcc00, #f1f500)';
    } else {
        progressbar.style.background = 'linear-gradient(to right, #d20000, #f51700)';
    }
}

init();