from pymongo import MongoClient
import pprint


pp = pprint.PrettyPrinter(indent=4)
client = MongoClient('mongodb+srv://me-using_new:b040oG9O5fqHJl8P@cluster0.6b5lg.mongodb.net/estates?authSource=admin&replicaSet=atlas-kjxazy-shard-0&w=majority&readPreference=primary&retryWrites=true&ssl=true')
result = client['socialsite']['dummyData'].aggregate(
    [
        {
            '$group': {
                '_id': None,
                'temp': {'$push': "$$ROOT"},
            },
        },
        {'$project': {
            '_id': 0,
            'modified_data': {'$reduce': {
                'input': "$temp",
                'initialValue': {
                    'prev': 0.0,
                    'results': [],
                },
                'in': {
                    'prev': "$$this.duration",
                    'results': {'$cond': {
                        'if': {'$and': [
                            {'$lte': ["$$this.duration", "$$value.prev"]},
                            {'$eq': ["$$this.is_amt_left", True]},
                            {'$eq': ["$$this.is_locked", False]},
                        ],
                        },
                        'then': {'$concatArrays': [
                            "$$value.results",
                            [
                                {
                                    'prevDuration': "$$value.prev",
                                    'id': "$$this.id",
                                    '_id': "$$this._id",
                                    'duration': "$$this.duration",
                                    'fail_count': "$$this.fail_count",
                                    'hedge': "$$this.hedge",
                                    'init_amt': "$$this.init_amt",
                                    'init_price': "$$this.init_price",
                                    'is_amt_left': "$$this.is_amt_left",
                                    'is_hedge_withdrawn': "$$this.is_hedge_withdrawn",
                                    'is_in_escrow_ac': "$$this.is_in_escrow_ac",
                                    'is_liq': "$$this.is_liq",
                                    'used_amt': "$$this.used_amt",
                                    'is_locked': "$$this.is_locked",
                                    'total_price': {'$subtract': [
                                        {'$multiply': [
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
                        'else': {'$concatArrays': [
                            "$$value.results",
                            [
                                {
                                    'prevDuration': "$$value.prev",

                                    'id': "$$this.id",
                                    '_id': "$$this._id",
                                    'duration': "$$this.duration",
                                    'fail_count': "$$this.fail_count",
                                    'hedge': "$$this.hedge",
                                    'init_amt': "$$this.init_amt",
                                    'init_price': "$$this.init_price",
                                    'is_amt_left': "$$this.is_amt_left",
                                    'is_hedge_withdrawn': "$$this.is_hedge_withdrawn",
                                    'is_in_escrow_ac': "$$this.is_in_escrow_ac",
                                    'is_liq': "$$this.is_liq",
                                    'used_amt': "$$this.used_amt",
                                    'is_locked': "$$this.is_locked",
                                    # 'total_price': 0
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
            "$sort" : {
                "total_price" : -1
            }
        }
       
    ]
)


resultData = list(result)[0]["modified_data"]["results"]

# check iff total_price is there and it's greater than or equal to 15
# for data in resultData:
#     if "total_price" in data :
#         pp.pprint(data)
    # if data["total_price"] != None  and data["total_price"] >= 15:
    #     print(data)
    #     break


# filter data where where the total_amount is greater than 15
filteredData = list(filter(lambda x: "total_price" in x, resultData))
# you just need to change the value here from -5 to 15
filter_total_price = list(
    filter(lambda x: x["total_price"] >= -4, filteredData))

pp.pprint(filter_total_price)
