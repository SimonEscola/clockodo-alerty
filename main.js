function getMinutesAfterMidnight(date) {
  return date.getHours() * 60 + date.getMinutes();
}

function getDataForEvent(dayLabel) {
  const [start, end] = dayLabel.split(" – ");
  const [startHours, startMinutes] = start.split(":");
  const [endHours, endMinutes] = end.split(":");
  const startTime = parseInt(startHours) * 60 + parseInt(startMinutes);
  const endTime = parseInt(endHours) * 60 + parseInt(endMinutes);
  const duration = endTime - startTime;
  const minutesAfterMidnight = getMinutesAfterMidnight(new Date());
  let finishedDuration = 0;
  if (endTime < minutesAfterMidnight) {
    finishedDuration = duration;
  } else if (startTime > minutesAfterMidnight) {
    finishedDuration = 0;
  } else {
    finishedDuration = minutesAfterMidnight - startTime;
  }
  return {
    start: startTime,
    duration,
    finishedDuration,
  };
}

function getDataOfToday() {

  const eventContainers = document.getElementsByClassName("rbc-events-container");

  const dayTimes = [];

  for (let index = 0; index < eventContainers.length; index++) {
    const eventContainer = eventContainers[index];
    const children = eventContainer.children;
    dayTimes.push({
      times: [],
    });
    for (const event of children) {
      if (event.className.includes("Break")) {
        continue;
      }
      const dateLabel = event.children[0].children[1].innerText;
      dayTimes[index].times.push(dateLabel)
    }
  }

  const todayIndex = new Date().getDay() - 1;
  const today = dayTimes.at(todayIndex)
  let durationOfToday = 0;
  let workedDurationOfToday = 0;
  for (const dayLabel of today.times) {
    const currentData = getDataForEvent(dayLabel);
    durationOfToday += currentData.duration;
    workedDurationOfToday += currentData.finishedDuration;
  }
  
  return {
    durationOfToday,
    workedDurationOfToday,
  };
}

function getTimeLabelOfMinutes(minutes) {
  return `${Math.floor(minutes / 60)} hours and ${minutes % 60} minutes (${minutes} minutes in total)`;
}

window.addEventListener("keydown", (event) => {
  if (event.code === "KeyI") {
    const todayData = getDataOfToday();
    alert(`
      Minutes worked: ${getTimeLabelOfMinutes(todayData.workedDurationOfToday)}
      Planned Time: ${getTimeLabelOfMinutes(todayData.durationOfToday)}
      Time to work: ${getTimeLabelOfMinutes(todayData.durationOfToday - todayData.workedDurationOfToday)}
      Percentage worked: ${(todayData.workedDurationOfToday / todayData.durationOfToday * 100).toFixed(2)}%
    `);
  }
});

