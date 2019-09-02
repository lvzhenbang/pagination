export default function makeRange(from, to) {
  const arr = [];

  for (let i = from; i < to + 1; i += 1) {
    arr.push(i);
  }

  return arr;
}
