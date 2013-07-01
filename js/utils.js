trUpperCase = function (str) {
  res = ""
  for (i=0;i<str.length;i++){
    chr = str[i]
    if (chr=="i"||chr=="İ"){
      res+="İ"
    } else if (chr=="ı"||chr=="I"){
      res+="I"
    } else {
      res+=chr.toUpperCase()
    }
  }
  return res
}
