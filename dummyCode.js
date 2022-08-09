// $cond: [
//   {
//     $and: [
//       { $lte: ["$$prev", "$$this.duration"] },
//       { $eq: ["$$this.is_amt_left", true] },
//       { $eq: ["$$this.is_locked", false] },
//     ],
//   },
//   {
//     $push: {
//       total_price: {
//         $multiply: [
//           "$$this.init_amt",
//           "$$this.init_price",
//         ],
//       },
//       ans: {
//         $divide: [
//           {
//             $subtract: [
//               {
//                 $multiply: [
//                   "$$this.init_amt",
//                   "$$this.init_price",
//                 ],
//               },
//               "$$this.init_amt",
//             ],
//           },
//           "$$this.duration",
//         ],
//       },
//     },
//   },
//   { $concatArrays: ["$$results", "$$this"] },
// ],

//write a loop that will print modified data , where the duration is greater than before and the is_amt_left is true and the is_locked is false. if the condition matched add total_price and ans to the object.
// const modifiedData = data.map(item => {
//     if (item.duration > 86400 && item.is_amt_left && !item.is_locked) {
//         item.total_price = item.init_amt * item.init_price;
//         item.ans = item.total_price - item.init_amt;
//     }
//     return item;
// }).filter(item => item.ans > 0);
// console.log(modifiedData);

//filter data by duration, is_amt_left, is_locked and add total_price and ans field if is_amt_left is true and is_locked is false and the duration is less than equal to other duration

// const firstDuration = data[0].duration;
// const result = data
//   .filter(
//     (item) =>
//       item.duration <= firstDuration &&
//       item.is_amt_left === true &&
//       item.is_locked === false
//   )
//   reduce(
//     (acc, item) => {
//       if (item.duration <= acc.duration) {
//         acc.total_price += item.init_amt * item.init_price
//         acc.ans = acc.total_price / acc.duration
//       }
//       return acc
//     },
//     {
//       duration: 0,
//       total_price: 0,
//       ans: 0,
//     }
//   )
// console.log(result)

//filter data by duration. add total_price and ans field if the duration is greater than 86400
// const result = data.filter(item => item.duration > 84400).map(item => {
//     const total_price = item.init_amt * item.init_price
//     const ans = total_price * item.duration / 86400
//     return {...item, total_price, ans}
// }
// )
// console.log(result)
