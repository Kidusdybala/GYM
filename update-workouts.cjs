const fs = require('fs');
const path = require('path');

const workoutsPath = path.join(__dirname, 'src', 'data', 'workouts.ts');
let content = fs.readFileSync(workoutsPath, 'utf-8');

const mapping = {
  "Bench Press": "/videos/chest/chest 1.mp4",
  "Overhead Press": "/videos/sholder/3IwAq8V0-_m6QQ_remux.mp4",
  "Incline Dumbbell Press": "/videos/chest/chest 2.mp4",
  "Lateral Raises": "/videos/sholder/ArVX0oZ2fK2APw_remux.mp4",
  "Tricep Pushdowns": "/videos/tryceps/triceps.mp4",
  "Deadlift": "/videos/back/CaYAuzAGFonF_Q_remux.mp4",
  "Pull-ups": "/videos/back/vCPajyZfB8x8tg_remux.mp4",
  "Barbell Row": "/videos/back/yDl3HitQ3t41YA_remux.mp4",
  "Face Pulls": "/videos/sholder/efTpfqQ_nA3OaQ_remux.mp4",
  "Barbell Curl": "/videos/byceps/3kOoAE8rItCnfw_remux.mp4",
  "Incline Bench Press": "/videos/chest/chest 3.mp4",
  "Chest-Supported Row": "/videos/back/CaYAuzAGFonF_Q_remux.mp4",
  "Arnold Press": "/videos/sholder/j2mXFa5DQRAkDQ_remux.mp4",
  "Lat Pulldown": "/videos/back/vCPajyZfB8x8tg_remux.mp4",
  "Hammer Curl": "/videos/for arm/fore arm excersie 1.mp4",
  "Crunches": "/videos/abs/0Ne_1cvlpL00LQ_remux.mp4",
  "Reverse Crunches": "/videos/abs/7mItRgKwucm6PQ_remux.mp4",
  "Plank": "/videos/abs/j1QEEU0dwsIkHA_remux.mp4",
  "Bicycle Crunches": "/videos/abs/kayBvo5es4bkHg_remux.mp4",
  "Side Plank": "/videos/abs/X7FSAOFM7JC_Dw_remux.mp4"
};

for (const [name, videoPath] of Object.entries(mapping)) {
  const regex = new RegExp(`(name:\\s*"${name}"[\\s\\S]*?image:\\s*)"(https:[^"]+)"`, 'g');
  content = content.replace(regex, `$1"${videoPath}"`);
}

fs.writeFileSync(workoutsPath, content, 'utf-8');
console.log("Updated workouts.ts");
