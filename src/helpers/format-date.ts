export function formatDate (date: Date) {
  let day = String(date.getDate());
  let month =  String(date.getMonth() + 1);
  let year =  String(date.getFullYear());

  if (Number(day) < 10) {
    day = '0' + day;
  }
  if (Number(month) < 10) {
    month = '0' + month;
  }

  return `${day}.${month}.${year}`;
}