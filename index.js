async function fetchData(filePath) {
	console.log(`Fetching data from: ${filePath}`);
	const response = await fetch(filePath);
	if (!response.ok) {
		return response;
	}
	console.log(`Status code from '${filePath.hostname}' : ${response.status}`);
	const data = await response.json();
	return data;
}

function calculateInitialPrice(num, percent) {
	return num / (1 - percent / 100);
}

function roundToNearestTenth(number) {
	return Math.round(number * 100) / 100;
}

function styleDate(date) {
	return new Intl.DateTimeFormat(undefined, { dateStyle: "full" }).format(
		date
	);
}

function checkForLastSale(dataSet) {
    const data = dataSet.data.history; 
    const StartDate = data[data.length - 2];
    const EndDate = data[data.length - 1];
    //console.log(data[data.length - 3]);
    if (StartDate.d === undefined) {
        return "This dataset is invalid, please retry with a valid set.";
    } else {
        if (StartDate.d == 0) {
            return "A sale is currently going on";
        } else {
            var daysInBetween = DaysBetween(StartDate.x, EndDate.x);
            console.log(
                `The last sale lasted for ${daysInBetween}, with a discount of ${StartDate.d}% off\nThe time between the previous sale was ${DaysBetween(data[data.length - 3].x,StartDate.x)} days or ${DaysBetween(data[data.length - 3].x, StartDate.x) / 7} weeks${DaysBetween(data[data.length - 3].x, StartDate.x) % 7 !== 0?` and ${DaysBetween(data[data.length - 3].x,StartDate.x) % 7}`:""}.`
              );
            var fixed = new Date(EndDate.x);
            console.log(fixed)
            if (StartDate) {

            }
            console.log(
                `The next sale is estimated to start on ${styleDate(new Date(fixed.setDate(fixed.getDate()+DaysBetween(data[data.length - 3].x,StartDate.x))))} or in ${DaysBetween(new Date(),new Date(new Date().setDate(new Date().getDate() + DaysBetween(data[data.length - 3].x,StartDate.x))))} days.`
            );
            const discountAvg = (StartDate.d + data[data.length - 4].d + data[data.length - 6].d + data[data.length - 8].d) / 4;
			console.log(DaysBetween(data[data.length - 5].x,data[data.length - 4].x));
			const timeBetweenSalesAvg = (DaysBetween(data[data.length - 3].x,StartDate.x)+DaysBetween(data[data.length - 5].x,data[data.length - 4].x))/2;
            console.log(discountAvg);
            return JSON.parse(`{"saleDuration": ${daysInBetween}, "timeBetweenSales": ${timeBetweenSalesAvg}, "priceEstimation": ${roundToNearestTenth(EndDate.y * (1-(discountAvg/100)))}, "discountEstimation": ${discountAvg}}`);
        }
    }
}

function DaysBetween(StartDate, EndDate) {
	// The number of milliseconds in all UTC days (no DST)
	const oneDay = 1000 * 60 * 60 * 24;

	// A day in UTC always lasts 24 hours (unlike in other time formats)
	const start = Date.UTC(
		new Date(EndDate).getFullYear(),
		new Date(EndDate).getMonth(),
		new Date(EndDate).getDate()
	);
	const end = Date.UTC(
		new Date(StartDate).getFullYear(),
		new Date(StartDate).getMonth(),
		new Date(StartDate).getDate()
	);

	// so it's safe to divide by 24 hours
	return (start - end) / oneDay;
}

//const blankName = fetch("./example.json")
//        .then(response => {
//            if (!response.ok) {
//                throw new Error(`HTTP Error: ${response.status}`);
//            }
//            return response.json();})
//            .then(data => console.log(data))
//            .catch(error => console.error('Failed to fetch data:', error));
const appID = new URLSearchParams(window.location.search).get("appID");
//var variable = blankName?.find(item => item.appID === toString(appID))
const errorMessages = [
	"yo lookie here theres an:",
	"yo theres an error right here:",
	"must have slipped through:",
];
(async () => {
	try {
		if (appID == undefined) {
			console.log("No appID provided, cannot look for app.");
			return;
		}

		const steamData = await fetchData(`test/steam/${appID}.json`); // change to ` https://store.steampowered.com/api/appdetails?appids=${appID}`
		if (steamData.ok == false) {
			throw new Error(`Could not fetch data from Steam`);
		} else if (steamData[appID].success == false) {
			throw new Error("AppID not found on Steam, must be invalid.");
		}

    document.getElementById("gameDetails").innerText += `${steamData[appID].data.name} (${appID})`;
		if (steamData[appID].data.is_free == true) {
			return console.log(`${steamData[appID].data.name} is a free game, no need for sale guessing.`);
		}
		const priceHistory = await fetchData(`./test/priceHistory/${appID}.json`); // change to `https://steamdb.info/GetPriceHistory/?appid=${appID}&cc=us`
    const saleData = checkForLastSale(priceHistory);
	if (!JSON.stringify(saleData).includes('saleDuration')) {
		return saleData;
	}
    document.getElementById('estimatedPrice').innerText = document.getElementById('estimatedPrice').innerText.replace('$0.00', `$${saleData["priceEstimation"]}`);
    // document.getElementById('nextSale').innerText += `${styleDate(new Date(new Date().setDate(new Date().getDate() + saleData.saleDuration)))}`

	} catch (error) {
		console.error(error);
	}
})();

// console.log(fetch("./413150/"))
