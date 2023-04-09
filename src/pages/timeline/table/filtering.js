/**
 * Logic for filtering data in a timeline
 */

import { testArrayOrValue } from "@/util";
import _ from "lodash";

const tvEpsRe = /^(\d+)(?:[–-](\d+))?$/;
const comicRe = /^(.*?)(\d+)$/;

// Timeline range comparison functions
// by date, by releasedate
// from, to
// year, title
// bby aby
const rangeFilterStrategies = {
  dateFromYearToYear: (from, to) => {
    if (from > to) return [];
    return (item) =>
      item.dateParsed?.some((date) => (date.date2 ?? date.date1) >= from && date.date1 <= to);
  },
  dateFromYear: (from, to) => {
    return (item) => item.dateParsed?.some((date) => (date.date2 ?? date.date1) >= from);
  },
  dateToYear: (from, to) => {
    return (item) => item.dateParsed?.some((date) => date.date1 <= to);
  },
  dateFromTitleToTitle: (from, to) => {
    return (item) => item.chronology >= from && item.chronology <= to;
  },
  dateFromTitle: (from, to) => {
    // TODO check for title's existance here, not Home, also exctract useMemo in a *smart* way
    return (item) => item.chronology >= from;
  },
  dateToTitle: (from, to) => {
    return (item) => item.chronology <= to;
  },
  dateFromYearToTitle: (from, to, dates) => {
    let titleDate = dates.reduce(
      (acc, v) => Math.max(acc, v.date2 ?? v.date1),
      Number.MIN_SAFE_INTEGER
    );
    return (item) =>
      item.dateParsed?.some(
        (date) => (date.date2 ?? date.date1) >= from && date.date1 <= titleDate
      ) && item.chronology <= to;
  },
  dateFromTitleToYear: (from, to, dates) => {
    let titleDate = dates.reduce((acc, v) => Math.min(acc, v.date1), Number.MAX_SAFE_INTEGER);
    return (item) =>
      item.chronology >= from &&
      item.dateParsed?.some((date) => (date.date2 ?? date.date1) >= titleDate && date.date1 <= to);
  },

  releaseDateFromYearToYear: (from, to) => {
    return (item) => {
      let rd = new Date(item.releaseDate);
      return rd >= from && rd <= to;
    };
  },
  releaseDateFromYear: (from, to) => {
    return (item) => new Date(item.releaseDate) >= from;
  },
  releaseDateToYear: (from, to) => {
    return (item) => new Date(item.releaseDate) <= to;
  },
  releaseDateFromTitleToTitle: (from, to) => {
    return (item) => {
      let rd = new Date(item.releaseDate);
      return rd >= from && rd <= to;
    };
  },
  releaseDateFromTitle: (from, to) => {
    return (item) => new Date(item.releaseDate) >= from;
  },
  releaseDateToTitle: (from, to) => {
    return (item) => new Date(item.releaseDate) <= to;
  },
  releaseDateFromYearToTitle: (from, to) => {
    return (item) => {
      let rd = new Date(item.releaseDate);
      return rd >= from && rd <= to;
    };
  },
  releaseDateFromTitleToYear: (from, to) => {
    return (item) => {
      let rd = new Date(item.releaseDate);
      return rd >= from && rd <= to;
    };
  },
};

// TODO rework this entire thing (filters in general)
// I made them to work at infinite depth but that doesnt make sense
// all filters should be max 2 depth
const filterItem = (filters, item) => {
  if (filters === undefined) {
    return false;
  }

  return Object.entries(filters).reduce((acc, [key, value]) => {
    if (item[key] === undefined) {
      return value["Other"] ?? value["Unknown"] ?? false;
    }
    // boolean key in data
    // TODO what is this? // TODO from future: why is this a todo????
    if (typeof value === "boolean") {
      // equivalent: item[key] ? value : true;
      return acc && (!item[key] || value);
    }
    // string key in data
    else {
      if (!testArrayOrValue(item[key], (v) => v in value)) {
        return acc && (value["Other"] || value["Unknown"]);
      }
      // leaf filter
      else if (testArrayOrValue(item[key], (v) => typeof value[v] === "boolean")) {
        return acc && testArrayOrValue(item[key], (v) => value[v]);
      }
      // Non leaf filter
      else {
        return acc && filterItem(value[item[key]], item);
      }
    }
  }, true);
};

// remove sibling values that all equate to false, to mimic shopping websites filters,
// that treat subgroups of unchecked filters as checked
const removeAllFalses = (filters) => {
  let acc = false;
  for (let [key, value] of Object.entries(filters)) {
    if (typeof value === "boolean") {
      acc ||= value;
    } else {
      let childrenChecked = removeAllFalses(value);
      if (!childrenChecked) delete filters[key];
      acc ||= childrenChecked;
    }
  }
  return acc;
};

// --------------------

export function collapseAdjacentEntries(data) {
  let next,
    first = null,
    match;

  return data.filter((item, i, arr) => {
    next = arr[i + 1];
    // Remove data from previous render
    delete item.collapseUntil;
    delete item.collapsedCount;

    if (
      (item.type === "tv" &&
        next?.type === "tv" &&
        item.series?.length &&
        next.series?.length &&
        next.series[0] === item.series[0] &&
        next.season === item.season &&
        (match = item.episode?.match(tvEpsRe)) &&
        +(match[2] ?? match[1]) + 1 === +next.episode?.match(tvEpsRe)[1]) ||
      (item.fullType === "comic" &&
        next?.fullType === "comic" &&
        item.title.match(comicRe)?.[1] === next.title.match(comicRe)?.[1] &&
        +item.title.match(comicRe)?.[2] + 1 === +next.title.match(comicRe)?.[2])
    ) {
      if (first === null) {
        first = i;
        return true;
      }
      return false;
    } else if (first !== null) {
      // Don't collapse just 2 entries
      if (first !== i - 1) {
        arr[first].collapseUntil = item;
        arr[first].collapseUntilTitle = item.title; // We need this specifically for search
        arr[first].collapseUntilSe = item.se; // We need this specifically for search
        // arr[first].collapsedCount = i - first; // use this to show how many entries are collapsed
        first = null;
        return false;
      }
      first = null;
    }
    return true;
  });
}

export function createSorter(by, ascending) {
  const aFirst = ascending ? -1 : 1;
  const bFirst = ascending ? 1 : -1;

  return (a, b) => {
    let av = a[by],
      bv = b[by];

    if (by === "releaseDate") {
      // Unknown release date always means unreleased, therefore the newest
      if (av == null) return bFirst;
      if (bv == null) return aFirst;
      if (a.releaseDateEffective) av = a.releaseDateEffective;
      if (b.releaseDateEffective) bv = b.releaseDateEffective;
    }
    if (av < bv) return aFirst;
    if (av > bv) return bFirst;
    return 0;
  };
}

export function createRangeStrategy(rangeFrom, rangeTo, timelineRangeBy) {
  let strategy = timelineRangeBy;
  if (rangeFrom) strategy += "From" + (rangeFrom.isTitle ? "Title" : "Year");
  if (rangeTo) strategy += "To" + (rangeTo.isTitle ? "Title" : "Year");

  return rangeFilterStrategies[strategy](
    rangeFrom?.value,
    rangeTo?.value,
    rangeFrom?.dates ?? rangeTo?.dates
  );
}

export function createTypeStrategy(typeFilters) {
  let cleanFilters = _.cloneDeep(typeFilters);
  removeAllFalses(cleanFilters);
  return (item) => filterItem(cleanFilters, item);
}

// Filter on fields of media. Currently only supports series
export function createFieldStrategy(boxFilters) {
  return (item) => {
    if (!item.series) return false;
    for (let boxFilter of boxFilters) {
      if (item.series.includes(boxFilter.title)) {
        return true;
      }
    }
  };
}

// filter by text. Searches title, writer, series
export function createTextStrategy(filterText) {
  // TODO: refactor
  // const re = /"([^"]*?)"/g;
  // let exact = Array.from(filterText.toLowerCase().matchAll(re));
  // let queries = filterText.replace(re, "").split(";");
  // let queries = filterText.toLowerCase().split(";");
  let queries = [filterText.toLowerCase()];
  return (item) => {
    let r = queries.map((v) => v.trim()).filter((v) => v);
    return r.length
      ? r.some((query) =>
          query
            .split(" ")
            .reduce(
              (acc, value) =>
                acc &&
                (item.title.toLowerCase().includes(value) ||
                  item.writer?.reduce((acc, v) => acc || v?.toLowerCase().includes(value), false) ||
                  item.series?.reduce((acc, v) => acc || v?.toLowerCase().includes(value), false)),
              true
            )
        )
      : r;
  };
}

export class Filterer {
  constructor(rawData, strategies) {
    this.data = [...rawData];
    this.strategies = strategies;
  }

  filter() {
    return this.data.filter((item) => this.strategies.every((strategy) => strategy(item)));
  }
}
