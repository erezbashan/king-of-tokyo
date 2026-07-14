const fs = require('fs');

let eng = fs.readFileSync('frontend/src/engine/gameEngine.ts', 'utf8');

// Ensure all getGame calls are followed by a null check. 
// Let's just find every "const game = await getGame(gameId);" without an "if (!game) return;" right after it.
eng = eng.replace(/const game = await getGame\(gameId\);\s+const p/g, "const game = await getGame(gameId);\n  if (!game) return;\n  const p");
eng = eng.replace(/const game = await getGame\(gameId\);\s+if \(!game\.history\)/g, "const game = await getGame(gameId);\n  if (!game) return;\n  if (!game.history)");
eng = eng.replace(/const game = await getGame\(gameId\);\s+game\.rollsLeft = 0;/g, "const game = await getGame(gameId);\n  if (!game) return;\n  game.rollsLeft = 0;");
eng = eng.replace(/const game = await getGame\(gameId\);\s+if \(!game\)/g, "const game = await getGame(gameId);\n  if (!game)");

// Fix some parameter anys that typescript complained about
eng = eng.replace(/d => d\.face/g, "(d: any) => d.face");
eng = eng.replace(/r => counts\[r\.face\]\+\+/g, "(r: any) => counts[r.face]++");
eng = eng.replace(/d2 => d2\.face/g, "(d2: any) => d2.face");
eng = eng.replace(/d => !\[/g, "(d: any) => ![");
eng = eng.replace(/pl => pl\.inTokyo/g, "(pl: any) => pl.inTokyo");

// Fix p as any and implicit anys more broadly
eng = eng.replace(/p\.cards\.some\(c =>/g, "p.cards.some((c: any) =>");
eng = eng.replace(/p\.cards\.reduce\(\(sum, c\)/g, "p.cards.reduce((sum: number, c: any)");
eng = eng.replace(/game\.marketCards\.findIndex\(c =>/g, "game.marketCards.findIndex((c: any) =>");
eng = eng.replace(/game\.currentDice\.map\(d =>/g, "game.currentDice.map((d: any) =>");
eng = eng.replace(/game\.currentDice\.filter\(d =>/g, "game.currentDice.filter((d: any) =>");
eng = eng.replace(/game\.currentDice\.filter\(d2 =>/g, "game.currentDice.filter((d2: any) =>");
eng = eng.replace(/other\.cards\.reduce\(\(sum: number, c: any\)/g, "other.cards.reduce((sum: number, c: any)");
eng = eng.replace(/other\.cards\.reduce\(\(sum, c: any\)/g, "other.cards.reduce((sum: number, c: any)");

fs.writeFileSync('frontend/src/engine/gameEngine.ts', eng);

