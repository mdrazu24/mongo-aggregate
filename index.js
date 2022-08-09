const express = require("express")
const app = express()
require("dotenv").config({ path: "./config.env" })
const { MongoClient } = require("mongodb")

const mongoClient = new MongoClient(process.env.MONGO_URI)

app.get("/getData", (req, res) => {
  const collection = mongoClient
    .db(process.env.DB)
    .collection(process.env.COLLECTION)

  collection
    .aggregate([
      {
        $group: {
          _id: null,
          temp: { $push: "$$ROOT" },
        },
      },
      {
        $project: {
          _id: 0,
          modified_data: {
            $reduce: {
              input: "$temp",
              initialValue: {
                prev: 0.0,
                results: [],
              },
              in: {
                prev: "$$this.duration",
                results: {
                  $cond: {
                    if: {
                      $and: [
                        { $lte: ["$$this.duration", "$$value.prev"] },
                        { $eq: ["$$this.is_amt_left", true] },
                        { $eq: ["$$this.is_locked", false] },
                      ],
                    },
                    then: {
                      $concatArrays: [
                        "$$value.results",
                        [
                          {
                            prevDuration: "$$value.prev",
                            id: "$$this.id",
                            _id: "$$this._id",
                            duration: "$$this.duration",
                            fail_count: "$$this.fail_count",
                            hedge: "$$this.hedge",
                            init_amt: "$$this.init_amt",
                            init_price: "$$this.init_price",
                            is_amt_left: "$$this.is_amt_left",
                            is_hedge_withdrawn: "$$this.is_hedge_withdrawn",
                            is_in_escrow_ac: "$$this.is_in_escrow_ac",
                            is_liq: "$$this.is_liq",
                            used_amt: "$$this.used_amt",
                            is_locked: "$$this.is_locked",
                            total_price: {
                              $subtract: [
                                {
                                  $multiply: [
                                    "$$this.init_amt",
                                    "$$this.init_price",
                                  ],
                                },
                                "$$this.used_amt",
                              ],
                            },
                          },
                        ],
                      ],
                    },
                    else: {
                      $concatArrays: [
                        "$$value.results",
                        [
                          {
                            prevDuration: "$$value.prev",

                            id: "$$this.id",
                            _id: "$$this._id",
                            duration: "$$this.duration",
                            fail_count: "$$this.fail_count",
                            hedge: "$$this.hedge",
                            init_amt: "$$this.init_amt",
                            init_price: "$$this.init_price",
                            is_amt_left: "$$this.is_amt_left",
                            is_hedge_withdrawn: "$$this.is_hedge_withdrawn",
                            is_in_escrow_ac: "$$this.is_in_escrow_ac",
                            is_liq: "$$this.is_liq",
                            used_amt: "$$this.used_amt",
                            is_locked: "$$this.is_locked",
                          },
                        ],
                      ],
                    },
                  },
                },
              },
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          modified_data: {
            //check if the total price is greater than 15
            $filter: {
              input: "$modified_data.results",
              as: "item",
              cond: {
                $gt: ["$$item.total_price", 15],
              },
            },

          },
        },
      }
    ])
    .toArray((err, result) => {
      if (err) {
          res.send(err)

        
      } else {
        res.send(result[0].modified_data)
      }
    })

})

app.listen(3000, async () => {
  console.log("Server is running on port 3000")
  try {
    await mongoClient.connect()
    console.log("Connected to MongoDB")
  } catch (err) {
    console.log(err)
  }
})

//OLD CODE
// //check each object and compare if the duration is less than equal to the previous object and return modified data
// console.time("time")
// const modifiedData = []
// let lastDuration
// for (let i = 0; i < data.length; i++) {
//   //check if the index is not the last index
//   if (i != data.length - 1) {
//     lastDuration = data[i].duration
//   }

//   for (let j = 0; j < data.length - 1; j++) {
//     const elementJ = data[j]
//     if (
//       elementJ.duration <= lastDuration &&
//       elementJ.is_amt_left === true &&
//       elementJ.is_locked === false
//     ) {
//       elementJ.ans = elementJ.init_amt * elementJ.init_price - elementJ.used_amt

//       const exist = modifiedData.find((item) => item.id === elementJ.id)
//       if (!exist) {
//         modifiedData.push(elementJ)
//       }
//     }
//   }
// }

// //check each modifiedData object which object ans is greater than 15
// const result = modifiedData.filter((item) => item.ans > 15)
// console.log(result)
// console.timeEnd("time")
