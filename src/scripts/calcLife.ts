// ref: https://nue2004.info/essay/essay10_2.htm

const currentAge = 31; // 現在の年齢
const referenceAge = 18; // 比較基準の年齢
const consciousAge = 5; // 物心の付いた年齢
const lifespan = 80; // 寿命

// 小数第2位まで表示し、末尾の0は省略
function format(num: number): string {
  return Number(num.toFixed(2)).toString();
}

const speed = currentAge / referenceAge;
const livedCurrent = currentAge * Math.log(currentAge / consciousAge);
const livedStandard = referenceAge * Math.log(currentAge / consciousAge);
const lifeCurrent = currentAge * Math.log(lifespan / consciousAge);
const lifeStandard = referenceAge * Math.log(lifespan / consciousAge);
const percent = (Math.log(currentAge / consciousAge) / Math.log(lifespan / consciousAge)) * 100;
const turningPoint = Math.sqrt(consciousAge * lifespan);
const isPastHalf = percent >= 50;

console.log(`あなたの人生の折り返し地点は ${format(turningPoint)}歳 のとき${isPastHalf ? 'でした。' : 'です。'}`);
console.log(`あなたは時間感覚の上では既に人生の ${format(percent)}% を過ごしています。`);
console.log(
  `${currentAge}歳現在、あなたにとっての時間の経つ速さは${referenceAge}歳のときと比べて ${format(speed)}倍 になっています。`
);

// const remainingYears = lifespan - currentAge;
// const perceivedRemaining = remainingYears / speed;
// const yearsSinceReference = currentAge - referenceAge;
// const perceivedYearsSinceReference = yearsSinceReference * speed;
// console.log(
//   `現在${currentAge}歳のあなたがあと ${remainingYears} 年生きると仮定すると、${format(perceivedRemaining)}年 しか残されていないように感じるかもしれません。`
// );
// console.log(
//   `20歳の頃から、あなたは ${format(yearsSinceReference)} 年生きていますが、体感的には ${format(perceivedYearsSinceReference)} 年 経過したように感じているでしょう。`
// );

// 将来の年齢での時間の速さ
const futureAges = [lifespan - 30, lifespan - 20, lifespan - 10];
for (const age of futureAges) {
  if (age > currentAge) {
    const futureSpeed = age / referenceAge;
    console.log(`${age}歳になると、時間の速さは${referenceAge}歳のときの ${format(futureSpeed)}倍 になります。`);
  }
}
