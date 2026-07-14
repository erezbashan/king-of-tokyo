const fs = require('fs');
let content = fs.readFileSync('backend/src/index.ts', 'utf8');

// Victory points
content = content.replace(
  `let winner = Object.values(state.players).find(p => p.victoryPoints >= 20);`,
  `let winner = Object.values(state.players).find(p => p.victoryPoints >= (state.settings?.winningVP || 20));`
);

// Max health bounds
content = content.replace(
  `actualHeal = Math.min((p.maxHealth || 10) - p.health, healsRemaining);`,
  `actualHeal = Math.min((p.maxHealth || game.settings?.maxHealth || 10) - p.health, healsRemaining);`
);
content = content.replace(
  `const actualHeal = Math.min(player.maxHealth || 10, player.health + card.effect.heal) - player.health;`,
  `const actualHeal = Math.min(player.maxHealth || game.settings?.maxHealth || 10, player.health + card.effect.heal) - player.health;`
);

// Initial health on join
content = content.replace(
  /health: 10/g,
  `health: game && game.settings ? game.settings.startingHealth : 10`
);

// Reset health on start game
content = content.replace(
  `p.health = 10;`,
  `p.health = game.settings?.startingHealth || 10;`
);

// Add logging to startTurn
content = content.replace(
  `game.rollsLeft = 3;`,
  `game.rollsLeft = 3;
  console.log(\`[DEBUG] \${gameId}: startTurn for \${playerId}. rollsLeft is now 3.\`);`
);

fs.writeFileSync('backend/src/index.ts', content, 'utf8');
