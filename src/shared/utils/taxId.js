export function isValidTaxId(input) {
  const s = String(input).replace(/\D/g,'');
  if (!/^\d{14}$/.test(s) || /^(\d)\1{13}$/.test(s)) return false;
  const digit = (arr, weights) => {
    const sum = weights.reduce((acc,w,i) => acc + Number(arr[i])*w,0);
    const mod = sum % 11;
    return mod < 2 ? 0 : 11 - mod;
  };
  return digit(s, [5,4,3,2,9,8,7,6,5,4,3,2]) === Number(s[12]) &&
    digit(s,[6,5,4,3,2,9,8,7,6,5,4,3,2]) === Number(s[13]);
}
