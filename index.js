const ccxt = require('ccxt');
const moment = require('moment');
const delay = require('delay');


// Hàm main để lấy giá

async function tick() {

    const binance = new ccxt.binance({
        API_Key: "Kb5VkRejEhSrO7SiPf0Hsutgw1myFO20O4L2np9BnaKmMepaeuWwDrQC2HjD1bte",
        Secret: "bQv04QbhaEBcUKa8dO43ucU54p1kNDrKY8OzuHA9cBmGavyIRvLmgg1MkCD0lbWV"
    });

    binance.setSandboxMode(true);

    async function printBalance() {
        const balance = await binance.fetchBalance();
        const total = balance.total;
        console.log(`Balance: BTC ${total.BTC}, USDT: ${total.USDT}`)
    }



    const price = await binance.fetchOHLCV('BTC/USD', '1m', undefined, 20);

    console.log(price);
    const bprice = price.map(() => {

        return {
            timestamp: moment(price[0]).format(),
            open: price[1],
            high: price[2], low: price[3],
            close: price[4],
            volume: price[5]
        }

    })
    const averagePrice = bprice.reduce((acc, price) =>
        acc + +price.close
        , 0) / 5;

    const lastPrice = bprice[bprice.length - 1].close;
    console.log(bprice.map(p => p.close));

    let direction;
    //Thuật toán mua-bán:
    if (lastPrice > averagePrice) {
        direction = 'sell';
    } else {
        direction = "buy";
    }

    const TRADE_SIZE = 100;
    const quantity = 100 / lastPrice;

    console.log(`Avarage price: ${averagePrice}. lastPrice: ${lastPrice}`);

    const order = await binance.createMarketOrder('BTC/USD', direction, quantity);
    console.log(`${moment().format()}: ${direction}${quantity} BTC at ${lastPrice}`);
    console.log(order);
    printBalance(lastPrice);

}

async function main() {
    while (true) {
        await tick();
        await delay(60 * 100);
    }
}

main();