async function readFile(filePath) {
  console.log(`Reading file from: ${filePath}`);
  const response = await fetch(filePath);
  if (!response.ok) {
    throw new Error(`Error thrown: ${response.stauts}`);
  }
  const data = await response.json();
  return data;
}

function calculateInitialPrice(num, percent) {
  return num / (1 - percent / 100);
}

function roundToNearestTenth(number) {
  return Math.ceil(number * 100) / 100;
}

function returnSaleName(input) {
  if (input === undefined) {
    return "";
  } else {
    return `\n${input}`;
  }
}

function checkForLastSale(StartDate, EndDate) {
  if (StartDate.d === undefined) {
    return "This dataset is invalid, please retry with a valid set.";
  } else {
    if (StartDate.d == 0) {
      return "A sale is currently going on";
    } else {
      return `The last sale lasted for ${DaysBetween(
        StartDate.x,
        EndDate.x
      )}, with a discount of ${StartDate.d}% off`;
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
  "yo lookie here theres an error:",
  "yo theres an error right here:",
  "must have slipped through:",
];
(async () => {
  try {
    const jsonData = await readFile("./actualexample.json");
    console.log(jsonData.data.history);
    for (x in jsonData.data.history) {
      const currentSaleHistory = jsonData.data.history[x];
      console.log(
        `${new Intl.DateTimeFormat(undefined, { dateStyle: "full" }).format(
          new Date(currentSaleHistory.x)
        )} → Inital Price: $${roundToNearestTenth(
          calculateInitialPrice(currentSaleHistory.y, currentSaleHistory.d)
        )}, Current Price: ${currentSaleHistory.f}${returnSaleName(
          jsonData.data.sales[currentSaleHistory.x]
        )}`
      );
    }
    console.log(
      DaysBetween(
        jsonData.data.history[jsonData.data.history.length - 2].x,
        jsonData.data.history[jsonData.data.history.length - 1].x
      )
    );
  } catch (error) {
    console.error(errorMessages[Math.floor(Math.random() * 3)], error);
  }
})();

// console.log(fetch("./413150/"))
