const fs = require('fs');
let content = fs.readFileSync('backend/src/index.ts', 'utf8');

// Fix healingGained
content = content.replace(
  `      if (actualHeal > 0) {
        p.health += actualHeal;
        game.logs.push(\`\${p.name} healed \${actualHeal} ❤️.\`);
      }`,
  `      if (actualHeal > 0) {
        p.health += actualHeal;
        if (p.gameStats) p.gameStats.healingGained += actualHeal;
        game.logs.push(\`\${p.name} healed \${actualHeal} ❤️.\`);
      }`
);

// Fix enteredTokyoCount when entering Tokyo due to no one being there
content = content.replace(
  `        p.victoryPoints = Math.min(20, p.victoryPoints + 1);
        game.logs.push(\`🏙️ \${p.name} entered Tokyo and gained 1 VP!\`);
      }
    }
  }`,
  `        p.victoryPoints = Math.min(20, p.victoryPoints + 1);
        if (p.gameStats) p.gameStats.enteredTokyoCount += 1;
        game.logs.push(\`🏙️ \${p.name} entered Tokyo and gained 1 VP!\`);
      }
    }
  }`
);

// Fix enteredTokyoCount when yielding Tokyo
content = content.replace(
  `        attacker.inTokyo = true;
        attacker.victoryPoints = Math.min(20, attacker.victoryPoints + 1);
        game.logs.push(\`🏙️ \${attacker.name} takes control of Tokyo!\`);
      }
      
      broadcastState(gameId);`,
  `        attacker.inTokyo = true;
        attacker.victoryPoints = Math.min(20, attacker.victoryPoints + 1);
        if (attacker.gameStats) attacker.gameStats.enteredTokyoCount += 1;
        game.logs.push(\`🏙️ \${attacker.name} takes control of Tokyo!\`);
      }
      
      broadcastState(gameId);`
);

// Fix bot cardsBought and energySpent (my last string replacement might have missed it if bots don't use 'cardToBuy')
// Let's check how bot buying works. We should use `replace_file_content` directly if it's too risky.

fs.writeFileSync('backend/src/index.ts', content, 'utf8');
