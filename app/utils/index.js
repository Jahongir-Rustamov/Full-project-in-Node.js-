import moment from "moment";
export default {
  ifequal(a, b, options) {
    a = JSON.stringify(a);
    b = JSON.stringify(b);
    // console.log("Comparing:", a, b); // Qiymatlarni tekshirish
    if (a == b) {
      return options.fn(this);
    }
    return options.inverse(this);
  },
  formatDate(date){
    return moment(date).format('DD MMM,YYYY')
  }
};
