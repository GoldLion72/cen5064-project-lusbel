function ProgressRules() {

    const areDatesValid = (startDate, endDate) => {
        const start = new Date(startDate);
        const end = new Date(endDate);

        if(isNaN(start.valueOf()) || isNaN(end.valueOf())) {
            return false;
        }

        if (start > end) {
            return false;
        }

        return true;
    }

    const wasProgressMade = (events) => {
        if(events.length === 0) {
            return false;
        }

        return events[0].VALUE < events[events.length - 1].VALUE;
    }

    return {
        areDatesValid,
        wasProgressMade
    }
}

export {ProgressRules}