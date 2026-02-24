// 1. THE DATA STRUCTURE
export const mock_db_bracket = [
  {
    id: "week14",
    title: "ARCHSTEPBOYZ <span>BRACKETOLOGY</span>",
    projectionDate: "FEB 2",
    // The Bubble Watch Data
    bubble: {
      last4In: [
        { name: "St. Mary's", logo: "teamlogos/ncaa/500/2608.png&h=200&w=200" },
        { name: "California", logo: "teamlogos/ncaa/500/25.png&h=200&w=200" },
        { name: "Seton Hall", logo: "teamlogos/ncaa/500/2550.png&h=200&w=200" },
        { name: "Ohio State", logo: "teamlogos/ncaa/500/194.png&h=200&w=200" }
      ],
      first4Out: [
        { name: "San Diego St.", logo: "teamlogos/ncaa/500/21.png&h=200&w=200" },
        { name: "VA Tech", logo: "teamlogos/ncaa/500/259.png&h=200&w=200" },
        { name: "Texas", logo: "teamlogos/ncaa/500/251.png&h=200&w=200" },
        { name: "VCU", logo: "teamlogos/ncaa/500/2670.png&h=200&w=200" }
      ],
      next4Out: [
        { name: "Santa Clara", logo: "teamlogos/ncaa/500/2541.png&h=200&w=200" },
        { name: "Nevada", logo: "teamlogos/ncaa/500/2440.png&h=200&w=200" },
        { name: "G. Mason", logo: "teamlogos/ncaa/500/2244.png&h=200&w=200" },
        { name: "Baylor", logo: "teamlogos/ncaa/500/239.png&h=200&w=200" }
      ]
    },
    // The 4 Regions. Order matters: [0]=South, [1]=West, [2]=East, [3]=Midwest
    regions: [
      {
        name: "South",
        site: "Houston, TX",
        headerClass: "bg-south",
        games: [
          { loc: "Philadelphia, PA", 
              t1: { s: 1, n: "UConn", l: "teamlogos/ncaa/500/41.png&h=200&w=200"}, 
              t2: { s: 16, n: "Navy", l: "teamlogos/ncaa/500/2426.png&h=200&w=200"} 
          },
          { loc: "Philadelphia, PA", 
              t1: { s: 8, n: "Kentucky", l: "teamlogos/ncaa/500/96.png&h=200&w=200"}, 
              t2: { s: 9, n: "Wisconsin", l: "teamlogos/ncaa/500/275.png&h=200&w=200"} 
          },
          { loc: "San Diego, CA", 
              t1: { s: 4, n: "Florida", l: "teamlogos/ncaa/500/57.png&h=200&w=200"}, 
              t2: { s: 13, n: "NDSU", l: "teamlogos/ncaa/500/2449.png&h=200&w=200"} 
          },
          { loc: "San Diego, CA", 
              t1: { s: 5, n: "Texas Tech", l: "teamlogos/ncaa/500/2641.png&h=200&w=200"}, 
              t2: { s: 12, n: "Tulsa", l: "teamlogos/ncaa/500/202.png&h=200&w=200"} 
          },
          { loc: "Greenville, SC", 
              t1: { s: 6, n: "Saint Louis", l: "teamlogos/ncaa/500/139.png&h=200&w=200"}, 
              t2: { s: 11, n: "Miami (OH)", l: "teamlogos/ncaa/500/193.png&h=200&w=200"} 
          },
          { loc: "Greenville, SC", 
              t1: { s: 3, n: "Vanderbilt", l: "teamlogos/ncaa/500/238.png&h=200&w=200"}, 
              t2: { s: 14, n: "Troy", l: "teamlogos/ncaa/500/2653.png&h=200&w=200"} 
          },
          { loc: "San Diego, CA", 
              t1: { s: 7, n: "Clemson", l: "teamlogos/ncaa/500/228.png&h=200&w=200"}, 
              t2: { s: 10, n: "UCLA", l: "teamlogos/ncaa/500/26.png&h=200&w=200"} 
          },
          { loc: "San Diego, CA", 
              t1: { s: 2, n: "Houston", l: "teamlogos/ncaa/500/248.png&h=200&w=200"}, 
              t2: { s: 15, n: "Wright State", l: "teamlogos/ncaa/500/2750.png&h=200&w=200"} 
          },
        ]
      },
      {
        name: "West",
        site: "San Jose, CA",
        headerClass: "bg-west",
        games: [
          { loc: "San Diego, CA", 
              t1: { s: 1, n: "Arizona", l: "teamlogos/ncaa/500/12.png&h=200&w=200"}, 
              t2: { s: 16, n: "BCU/MD-ES", l: "teamlogos/default-team-logo-500.png&h=72&w=72"} 
          },
          { loc: "San Diego, CA", 
              t1: { s: 8, n: "Georgia", l: "teamlogos/ncaa/500/61.png&h=200&w=200"}, 
              t2: { s: 9, n: "SMU", l: "teamlogos/ncaa/500/2567.png&h=72&w=72"} 
          },
          { loc: "Oklahoma City, OK", 
              t1: { s: 4, n: "BYU", l: "teamlogos/ncaa/500/252.png&h=200&w=200"}, 
              t2: { s: 13, n: "High Point", l: "teamlogos/ncaa/500/2272.png&h=72&w=72"} 
          },
          { loc: "Oklahoma City, OK", 
              t1: { s: 5, n: "Louisville", l: "teamlogos/ncaa/500/97.png&h=200&w=200"}, 
              t2: { s: 12, n: "Liberty", l: "teamlogos/ncaa/500/2335.png&h=72&w=72"} 
          },
          { loc: "Portland, OR", 
              t1: { s: 6, n: "Alabama", l: "teamlogos/ncaa/500/333.png&h=200&w=200"}, 
              t2: { s: 11, n: "USC", l: "teamlogos/ncaa/500/30.png&h=72&w=72"} 
          },
          { loc: "Portland, OR", 
              t1: { s: 3, n: "Gonzaga", l: "teamlogos/ncaa/500/2250.png&h=200&w=200"}, 
              t2: { s: 14, n: "UC Irvine", l: "teamlogos/ncaa/500/300.png&h=72&w=72"} 
          },
          { loc: "Portland, OR", 
              t1: { s: 7, n: "Utah State", l: "teamlogos/ncaa/500/328.png&h=200&w=200"}, 
              t2: { s: 10, n: "Indiana", l: "teamlogos/ncaa/500/84.png&h=72&w=72"} 
          },
          { loc: "Portland, OR", 
              t1: { s: 2, n: "Nebraska", l: "teamlogos/ncaa/500/158.png&h=200&w=200"}, 
              t2: { s: 15, n: "UT Martin", l: "teamlogos/ncaa/500/2630.png&h=72&w=72"} 
          },
        ]
      },
      {
        name: "East",
        site: "Washington DC",
        headerClass: "bg-east",
        games: [
           { loc: "Greenville, SC", 
               t1: { s: 1, n: "Duke", l: "teamlogos/ncaa/500/150.png&h=200&w=200"}, 
               t2: { s: 16, n: "Long Island", l: "teamlogos/ncaa/500/112358.png&h=200&w=200"} 
           },
           { loc: "Greenville, SC", 
               t1: { s: 8, n: "UCF", l: "teamlogos/ncaa/500/2116.png&h=200&w=200"}, 
               t2: { s: 9, n: "Auburn", l: "teamlogos/ncaa/500/2.png&h=200&w=200"} 
           },
           { loc: "Tampa, FL", 
               t1: { s: 4, n: "Virginia", l: "teamlogos/ncaa/500/258.png&h=200&w=200"}, 
               t2: { s: 13, n: "UNCW", l: "teamlogos/ncaa/500/350.png&h=200&w=200"} 
           },
           { loc: "Tampa, FL", 
               t1: { s: 5, n: "Arkansas", l: "teamlogos/ncaa/500/8.png&h=200&w=200"}, 
               t2: { s: 12, n: "Belmont", l: "teamlogos/ncaa/500/2057.png&h=200&w=200"} 
           },
           { loc: "St. Louis, MO", 
               t1: { s: 6, n: "Tennessee", l: "teamlogos/ncaa/500/2633.png&h=200&w=200"}, 
               t2: { s: 11, n: "Cal/Seton Hall", l: "teamlogos/default-team-logo-500.png&h=72&w=72"} 
           },
           { loc: "St. Louis, MO", 
               t1: { s: 3, n: "Purdue", l: "teamlogos/ncaa/500/2509.png&h=200&w=200"}, 
               t2: { s: 14, n: "ETSU", l: "teamlogos/ncaa/500/2193.png&h=200&w=200"} 
           },
           { loc: "Oklahoma City, OK", 
               t1: { s: 7, n: "Texas A&M", l: "teamlogos/ncaa/500/245.png&h=200&w=200"}, 
               t2: { s: 10, n: "Miami (FL)", l: "teamlogos/ncaa/500/2390.png&h=200&w=200"} 
           },
           { loc: "Oklahoma City, OK", 
               t1: { s: 2, n: "Illinois", l: "teamlogos/ncaa/500/356.png&h=200&w=200"}, 
               t2: { s: 15, n: "Portland St", l: "teamlogos/ncaa/500/2502.png&h=200&w=200"} 
           },
        ]
      },
      {
        name: "Midwest",
        site: "Chicago, IL",
        headerClass: "bg-midwest",
        games: [
           { loc: "Buffalo, NY", 
               t1: { s: 1, n: "Michigan", l: "teamlogos/ncaa/500/130.png&h=200&w=200"}, 
               t2: { s: 16, n: "Merrimack/UMBC", l: "teamlogos/default-team-logo-500.png&h=72&w=72"} 
           },
           { loc: "Buffalo, NY", 
               t1: { s: 8, n: "NC State", l: "teamlogos/ncaa/500/152.png&h=200&w=200"}, 
               t2: { s: 9, n: "Villanova", l: "teamlogos/ncaa/500/222.png&h=200&w=200"} 
           },
           { loc: "Philadelphia, PA", 
               t1: { s: 4, n: "Kansas", l: "teamlogos/ncaa/500/2305.png&h=200&w=200"}, 
               t2: { s: 13, n: "S.F. Austin", l: "teamlogos/ncaa/500/2617.png&h=200&w=200"} 
           },
           { loc: "Philadelphia, PA", 
               t1: { s: 5, n: "St. John's", l: "teamlogos/ncaa/500/2599.png&h=200&w=200"}, 
               t2: { s: 12, n: "Yale", l: "teamlogos/ncaa/500/43.png&h=200&w=200"} 
           },
           { loc: "Buffalo, NY", 
               t1: { s: 6, n: "North Carolina", l: "teamlogos/ncaa/500/153.png&h=200&w=200"}, 
               t2: { s: 11, n: "St. Mary's/Ohio St", l: "teamlogos/default-team-logo-500.png&h=72&w=72"} 
           },
           { loc: "Buffalo, NY", 
               t1: { s: 3, n: "Michigan State", l: "teamlogos/ncaa/500/127.png&h=200&w=200"}, 
               t2: { s: 14, n: "Cal Baptist", l: "teamlogos/ncaa/500/2856.png&h=200&w=200"} 
           },
           { loc: "St. Louis, MO", 
               t1: { s: 7, n: "Iowa", l: "teamlogos/ncaa/500/2294.png&h=200&w=200"}, 
               t2: { s: 10, n: "New Mexico", l: "teamlogos/ncaa/500/167.png&h=200&w=200"} 
           },
           { loc: "St. Louis, MO", 
               t1: { s: 2, n: "Iowa State", l: "teamlogos/ncaa/500/66.png&h=200&w=200"}, 
               t2: { s: 15, n: "Austin Peay", l: "teamlogos/ncaa/500/2046.png&h=200&w=200"} 
           },
        ]
      }
    ]
  },
  {
    id: "week15",
    title: "ARCHSTEPBOYZ <span>BRACKETOLOGY</span>",
    projectionDate: "FEB 9",
    // The Bubble Watch Data
    bubble: {
      last4In: [
        { name: "Ohio State", logo: "teamlogos/ncaa/500/194.png&h=200&w=200" },
        { name: "San Diego St.", logo: "teamlogos/ncaa/500/21.png&h=200&w=200" },
        { name: "Santa Clara", logo: "teamlogos/ncaa/500/2541.png&h=200&w=200" },
        { name: "USC", logo: "teamlogos/ncaa/500/30.png&h=200&w=200" },
      ],
      first4Out: [
        { name: "California", logo: "teamlogos/ncaa/500/25.png&h=200&w=200" },
        { name: "Baylor", logo: "teamlogos/ncaa/500/239.png&h=200&w=200" },
        { name: "New Mexico", logo: "teamlogos/ncaa/500/167.png&h=200&w=200" },
        { name: "VCU", logo: "teamlogos/ncaa/500/2670.png&h=200&w=200" },
      ],
      next4Out: [
        { name: "VA Tech", logo: "teamlogos/ncaa/500/259.png&h=200&w=200" },
        { name: "Seton Hall", logo: "teamlogos/ncaa/500/2550.png&h=200&w=200" },
        { name: "Boise St", logo: "teamlogos/ncaa/500/68.png&h=200&w=200" },
        { name: "TCU", logo: "teamlogos/ncaa/500/2628.png&h=200&w=200" },
      ]
    },
    // The 4 Regions. Order matters: [0]=South, [1]=West, [2]=East, [3]=Midwest
    regions: [
      {
        name: "South",
        site: "Houston, TX",
        headerClass: "bg-south",
        games: [
          { loc: "Philadelphia, PA", 
              t1: { s: 1, n: "UConn", l: "teamlogos/ncaa/500/41.png&h=200&w=200", conf: true}, 
              t2: { s: 16, n: "Navy", l: "teamlogos/ncaa/500/2426.png&h=200&w=200", conf: true} 
          },
          { loc: "Philadelphia, PA", 
              t1: { s: 8, n: "NC State", l: "teamlogos/ncaa/500/152.png&h=200&w=200", conf: false}, 
              t2: { s: 9, n: "Auburn", l: "teamlogos/ncaa/500/2.png&h=200&w=200", conf: false} 
          },
          { loc: "Tampa, FL", 
              t1: { s: 4, n: "Virginia", l: "teamlogos/ncaa/500/258.png&h=200&w=200", conf: false}, 
              t2: { s: 13, n: "High Point", l: "teamlogos/ncaa/500/2272.png&h=200&w=200", conf: true} 
          },
          { loc: "Tampa, FL", 
              t1: { s: 5, n: "BYU", l: "teamlogos/ncaa/500/252.png&h=200&w=200", conf: false}, 
              t2: { s: 12, n: "Yale", l: "teamlogos/ncaa/500/43.png&h=200&w=200", conf: true} 
          },
          { loc: "Philadelphia, PA", 
              t1: { s: 6, n: "Alabama", l: "teamlogos/ncaa/500/333.png&h=200&w=200", conf: false}, 
              t2: { s: 11, n: "Miami (OH)", l: "teamlogos/ncaa/500/193.png&h=200&w=200", conf: true} 
          },
          { loc: "Philadelphia, PA", 
              t1: { s: 3, n: "Purdue", l: "teamlogos/ncaa/500/2509.png&h=200&w=200", conf: false}, 
              t2: { s: 14, n: "ETSU", l: "teamlogos/ncaa/500/2193.png&h=200&w=200", conf: true} 
          },
          { loc: "Oklahoma City, OK", 
              t1: { s: 7, n: "Tennessee", l: "teamlogos/ncaa/500/2633.png&h=200&w=200", conf: false}, 
              t2: { s: 10, n: "UCLA", l: "teamlogos/ncaa/500/26.png&h=200&w=200", conf: false} 
          },
          { loc: "Oklahoma City, OK", 
              t1: { s: 2, n: "Houston", l: "teamlogos/ncaa/500/248.png&h=200&w=200", conf: false}, 
              t2: { s: 15, n: "Austin Peay", l: "teamlogos/ncaa/500/2046.png&h=200&w=200", conf: true} 
          },
        ]
      },
      {
        name: "West",
        site: "San Jose, CA",
        headerClass: "bg-west",
        games: [
          { loc: "San Diego, CA", 
              t1: { s: 1, n: "Arizona", l: "teamlogos/ncaa/500/12.png&h=200&w=200", conf: true}, 
              t2: { s: 16, n: "BCU/Morgan St", l: "teamlogos/default-team-logo-500.png&h=72&w=72", conf: true} 
          },
          { loc: "San Diego, CA", 
              t1: { s: 8, n: "Georgia", l: "teamlogos/ncaa/500/61.png&h=200&w=200", conf: false}, 
              t2: { s: 9, n: "Wisconsin", l: "teamlogos/ncaa/500/275.png&h=72&w=72", conf: false} 
          },
          { loc: "Portland, OR", 
              t1: { s: 4, n: "Gonzaga", l: "teamlogos/ncaa/500/2250.png&h=200&w=200", conf: true}, 
              t2: { s: 13, n: "N Dakota St", l: "teamlogos/ncaa/500/2449.png&h=72&w=72", conf: true} 
          },
          { loc: "Portland, OR", 
              t1: { s: 5, n: "N Carolina", l: "teamlogos/ncaa/500/153.png&h=200&w=200", conf: false}, 
              t2: { s: 12, n: "S Florida", l: "teamlogos/ncaa/500/58.png&h=72&w=72", conf: true} 
          },
          { loc: "Greenville, SC", 
              t1: { s: 6, n: "Saint Louis", l: "teamlogos/ncaa/500/139.png&h=200&w=200", conf: true}, 
              t2: { s: 11, n: "Ohio St/Santa Clara", l: "teamlogos/default-team-logo-500.png&h=72&w=72", conf: false} 
          },
          { loc: "Greenville, SC", 
              t1: { s: 3, n: "Vanderbilt", l: "teamlogos/ncaa/500/238.png&h=200&w=200", conf: false}, 
              t2: { s: 14, n: "Troy", l: "teamlogos/ncaa/500/2653.png&h=72&w=72", conf: true} 
          },
          { loc: "Portland, OR", 
              t1: { s: 7, n: "Utah State", l: "teamlogos/ncaa/500/328.png&h=200&w=200", conf: true}, 
              t2: { s: 10, n: "Indiana", l: "teamlogos/ncaa/500/84.png&h=72&w=72", conf: false} 
          },
          { loc: "Portland, OR", 
              t1: { s: 2, n: "Nebraska", l: "teamlogos/ncaa/500/158.png&h=200&w=200", conf: false}, 
              t2: { s: 15, n: "UT Martin", l: "teamlogos/ncaa/500/2630.png&h=72&w=72", conf: true} 
          },
        ]
      },
      {
        name: "East",
        site: "Washington DC",
        headerClass: "bg-east",
        games: [
           { loc: "Greenville, SC", 
               t1: { s: 1, n: "Duke", l: "teamlogos/ncaa/500/150.png&h=200&w=200", conf: true}, 
               t2: { s: 16, n: "Long Island", l: "teamlogos/ncaa/500/112358.png&h=200&w=200", conf: true} 
           },
           { loc: "Greenville, SC",
               t1: { s: 8, n: "Texas A&M", l: "teamlogos/ncaa/500/245.png&h=200&w=200", conf: false}, 
               t2: { s: 9, n: "UCF", l: "teamlogos/ncaa/500/2116.png&h=200&w=200", conf: false} 
           },
           { loc: "Oklahoma City, OK", 
               t1: { s: 4, n: "Florida", l: "teamlogos/ncaa/500/57.png&h=200&w=200", conf: true}, 
               t2: { s: 13, n: "UNCW", l: "teamlogos/ncaa/500/350.png&h=200&w=200", conf: true} 
           },
           { loc: "Oklahoma City, OK", 
               t1: { s: 5, n: "St. John's", l: "teamlogos/ncaa/500/2599.png&h=200&w=200", conf: false}, 
               t2: { s: 12, n: "Liberty", l: "teamlogos/ncaa/500/2335.png&h=200&w=200", conf: true} 
           },
           { loc: "St. Louis, MO", 
               t1: { s: 6, n: "Arkansas", l: "teamlogos/ncaa/500/8.png&h=200&w=200", conf: false}, 
               t2: { s: 11, n: "San Diego St/USC", l: "teamlogos/default-team-logo-500.png&h=72&w=72", conf: false} 
           },
           { loc: "St. Louis, MO", 
               t1: { s: 3, n: "Kansas", l: "teamlogos/ncaa/500/2305.png&h=200&w=200", conf: false}, 
               t2: { s: 14, n: "Hawai'i", l: "teamlogos/ncaa/500/62.png&h=200&w=200", conf: true} 
           },
           { loc: "Tampa, FL", 
               t1: { s: 7, n: "Kentucky", l: "teamlogos/ncaa/500/96.png&h=200&w=200", conf: false}, 
               t2: { s: 10, n: "Miami (FL)", l: "teamlogos/ncaa/500/2390.png&h=200&w=200", conf: false} 
           },
           { loc: "Tampa, FL", 
               t1: { s: 2, n: "Illinois", l: "teamlogos/ncaa/500/356.png&h=200&w=200", conf: false}, 
               t2: { s: 15, n: "Portland St", l: "teamlogos/ncaa/500/2502.png&h=200&w=200", conf: true} 
           },
        ]
      },
      {
        name: "Midwest",
        site: "Chicago, IL",
        headerClass: "bg-midwest",
        games: [
           { loc: "Buffalo, NY", 
               t1: { s: 1, n: "Michigan", l: "teamlogos/ncaa/500/130.png&h=200&w=200", conf: true}, 
               t2: { s: 16, n: "Merrimack/NJIT", l: "teamlogos/default-team-logo-500.png&h=72&w=72", conf: true} 
           },
           { loc: "Buffalo, NY", 
               t1: { s: 8, n: "Villanova", l: "teamlogos/ncaa/500/222.png&h=200&w=200", conf: false}, 
               t2: { s: 9, n: "SMU", l: "teamlogos/ncaa/500/2567.png&h=200&w=200", conf: false} 
           },
           { loc: "Oklahoma City, OK", 
               t1: { s: 4, n: "Texas Tech", l: "teamlogos/ncaa/500/2641.png&h=200&w=200", conf: false}, 
               t2: { s: 13, n: "S.F. Austin", l: "teamlogos/ncaa/500/2617.png&h=200&w=200", conf: true} 
           },
           { loc: "Oklahoma City, OK", 
               t1: { s: 5, n: "Louisville", l: "teamlogos/ncaa/500/97.png&h=200&w=200", conf: false}, 
               t2: { s: 12, n: "Belmont", l: "teamlogos/ncaa/500/2057.png&h=200&w=200", conf: true} 
           },
           { loc: "Buffalo, NY", 
               t1: { s: 6, n: "Clemson", l: "teamlogos/ncaa/500/228.png&h=200&w=200", conf: false}, 
               t2: { s: 11, n: "Texas", l: "teamlogos/ncaa/500/251.png&h=200&w=200", conf: false} 
           },
           { loc: "Buffalo, NY", 
               t1: { s: 3, n: "Michigan State", l: "teamlogos/ncaa/500/127.png&h=200&w=200", conf: false}, 
               t2: { s: 14, n: "Cal Baptist", l: "teamlogos/ncaa/500/2856.png&h=200&w=200", conf: true} 
           },
           { loc: "St. Louis, MO", 
               t1: { s: 7, n: "Iowa", l: "teamlogos/ncaa/500/2294.png&h=200&w=200", conf: false}, 
               t2: { s: 10, n: "St. Mary's", l: "teamlogos/ncaa/500/2608.png&h=200&w=200", conf: false} 
           },
           { loc: "St. Louis, MO", 
               t1: { s: 2, n: "Iowa State", l: "teamlogos/ncaa/500/66.png&h=200&w=200", conf: false}, 
               t2: { s: 15, n: "Wright State", l: "teamlogos/ncaa/500/2750.png&h=200&w=200", conf: true} 
           },
        ]
      }
    ]
  },
  {
    id: "week16",
    title: "ARCHSTEPBOYZ <span>BRACKETOLOGY</span>",
    projectionDate: "FEB 16",
    // The Bubble Watch Data
    bubble: {
      last4In: [
        { name: "USC", logo: "teamlogos/ncaa/500/30.png&h=200&w=200" },
        { name: "San Diego St", logo: "teamlogos/ncaa/500/21.png&h=200&w=200" },
        { name: "Missouri", logo: "teamlogos/ncaa/500/142.png&h=200&w=200" },
        { name: "Ohio St", logo: "teamlogos/ncaa/500/194.png&h=200&w=200" },
      ],
      first4Out: [
        { name: "Santa Clara", logo: "teamlogos/ncaa/500/2541.png&h=200&w=200" },
        { name: "TCU", logo: "teamlogos/ncaa/500/2628.png&h=200&w=200" },
        { name: "New Mexico", logo: "teamlogos/ncaa/500/167.png&h=200&w=200" },
        { name: "VCU", logo: "teamlogos/ncaa/500/2670.png&h=200&w=200" },
      ],
      next4Out: [
        { name: "Virginia Tech", logo: "teamlogos/ncaa/500/259.png&h=200&w=200" },
        { name: "California", logo: "teamlogos/ncaa/500/25.png&h=200&w=200" },
      ]
    },
    // The 4 Regions. Order matters: [0]=South, [1]=West, [2]=East, [3]=Midwest
    regions: [
      {
        name: "South",
        site: "Houston, TX",
        headerClass: "bg-south",
        games: [
          { loc: "Oklahoma City, OK", 
              t1: { s: 1, n: "Houston", l: "teamlogos/ncaa/500/248.png&h=200&w=200", conf: true}, 
              t2: { s: 16, n: "BCU/Morgan St", l: "teamlogos/default-team-logo-500.png&h=72&w=72", conf: true} 
          },
          { loc: "Oklahoma City, OK", 
              t1: { s: 8, n: "NC State", l: "teamlogos/ncaa/500/152.png&h=200&w=200", conf: false}, 
              t2: { s: 9, n: "Texas A&M", l: "teamlogos/ncaa/500/245.png&h=200&w=200", conf: false} 
          },
          { loc: "Greenville, SC", 
              t1: { s: 4, n: "Vanderbilt", l: "teamlogos/ncaa/500/238.png&h=200&w=200", conf: false}, 
              t2: { s: 13, n: "High Point", l: "teamlogos/ncaa/500/2272.png&h=200&w=200", conf: true} 
          },
          { loc: "Greenville, SC", 
              t1: { s: 5, n: "N Carolina", l: "teamlogos/ncaa/500/153.png&h=200&w=200", conf: false}, 
              t2: { s: 12, n: "Yale", l: "teamlogos/ncaa/500/43.png&h=200&w=200", conf: true} 
          },
          { loc: "San Diego, CA", 
              t1: { s: 6, n: "Tennessee", l: "teamlogos/ncaa/500/2633.png&h=200&w=200", conf: false}, 
              t2: { s: 11, n: "San Diego St/Ohio St", l: "teamlogos/default-team-logo-500.png&h=72&w=72", conf: false} 
          },
          { loc: "San Diego, CA", 
              t1: { s: 3, n: "Kansas", l: "teamlogos/ncaa/500/2305.png&h=200&w=200", conf: false}, 
              t2: { s: 14, n: "N Dakota St", l: "teamlogos/ncaa/500/2449.png&h=200&w=200", conf: true} 
          },
          { loc: "St. Louis, MO", 
              t1: { s: 7, n: "Kentucky", l: "teamlogos/ncaa/500/96.png&h=200&w=200", conf: false}, 
              t2: { s: 10, n: "St. Mary's", l: "teamlogos/ncaa/500/2608.png&h=200&w=200", conf: false} 
          },
          { loc: "St. Louis, MO", 
              t1: { s: 2, n: "Illinois", l: "teamlogos/ncaa/500/356.png&h=200&w=200", conf: false}, 
              t2: { s: 15, n: "Austin Peay", l: "teamlogos/ncaa/500/2046.png&h=200&w=200", conf: true} 
          },
        ]
      },
      {
        name: "West",
        site: "San Jose, CA",
        headerClass: "bg-west",
        games: [
          { loc: "San Diego, CA", 
              t1: { s: 1, n: "Arizona", l: "teamlogos/ncaa/500/12.png&h=200&w=200", conf: true}, 
              t2: { s: 16, n: "Navy", l: "teamlogos/ncaa/500/2426.png&h=200&w=200", conf: true} 
          },
          { loc: "San Diego, CA", 
              t1: { s: 8, n: "Iowa", l: "teamlogos/ncaa/500/2294.png&h=200&w=200", conf: false}, 
              t2: { s: 9, n: "SMU", l: "teamlogos/ncaa/500/2567.png&h=72&w=72", conf: false} 
          },
          { loc: "Portland, OR", 
              t1: { s: 4, n: "Virginia", l: "teamlogos/ncaa/500/258.png&h=200&w=200", conf: false}, 
              t2: { s: 13, n: "Hawai'i", l: "teamlogos/ncaa/500/62.png&h=72&w=72", conf: true} 
          },
          { loc: "Portland, OR", 
              t1: { s: 5, n: "Arkansas", l: "teamlogos/ncaa/500/8.png&h=200&w=200", conf: false}, 
              t2: { s: 12, n: "S Florida", l: "teamlogos/ncaa/500/58.png&h=72&w=72", conf: true} 
          },
          { loc: "Philadelphia, PA", 
              t1: { s: 6, n: "BYU", l: "teamlogos/ncaa/500/252.png&h=200&w=200", conf: false}, 
              t2: { s: 11, n: "Georgia", l: "teamlogos/ncaa/500/61.png&h=200&w=200", conf: false} 
          },
          { loc: "Philadelphia, PA", 
              t1: { s: 3, n: "Michigan St", l: "teamlogos/ncaa/500/127.png&h=200&w=200", conf: false}, 
              t2: { s: 14, n: "Troy", l: "teamlogos/ncaa/500/2653.png&h=72&w=72", conf: true} 
          },
          { loc: "Oklahoma City, OK", 
              t1: { s: 7, n: "Utah St", l: "teamlogos/ncaa/500/328.png&h=200&w=200", conf: true}, 
              t2: { s: 10, n: "Auburn", l: "teamlogos/ncaa/500/2.png&h=72&w=72", conf: false} 
          },
          { loc: "Oklahoma City, OK", 
              t1: { s: 2, n: "Nebraska", l: "teamlogos/ncaa/500/158.png&h=200&w=200", conf: false}, 
              t2: { s: 15, n: "UT Martin", l: "teamlogos/ncaa/500/2630.png&h=72&w=72", conf: true} 
          },
        ]
      },
      {
        name: "East",
        site: "Washington DC",
        headerClass: "bg-east",
        games: [
           { loc: "Greenville, SC", 
               t1: { s: 1, n: "Duke", l: "teamlogos/ncaa/500/150.png&h=200&w=200", conf: true}, 
               t2: { s: 16, n: "Merrimack", l: "teamlogos/ncaa/500/2771.png&h=200&w=200", conf: true} 
           },
           { loc: "Greenville, SC",
               t1: { s: 8, n: "Wisconsin", l: "teamlogos/ncaa/500/275.png&h=200&w=200", conf: false}, 
               t2: { s: 9, n: "Texas", l: "teamlogos/ncaa/500/251.png&h=200&w=200", conf: false} 
           },
           { loc: "Portland, OR", 
               t1: { s: 4, n: "Gonzaga", l: "teamlogos/ncaa/500/2250.png&h=200&w=200", conf: true}, 
               t2: { s: 13, n: "UNCW", l: "teamlogos/ncaa/500/350.png&h=200&w=200", conf: true} 
           },
           { loc: "Portland, OR", 
               t1: { s: 5, n: "Louisville", l: "teamlogos/ncaa/500/97.png&h=200&w=200", conf: false}, 
               t2: { s: 12, n: "Liberty", l: "teamlogos/ncaa/500/2335.png&h=200&w=200", conf: true} 
           },
           { loc: "Buffalo, NY", 
               t1: { s: 6, n: "Alabama", l: "teamlogos/ncaa/500/333.png&h=200&w=200", conf: false}, 
               t2: { s: 11, n: "Miami (OH)", l: "teamlogos/ncaa/500/193.png&h=200&w=200", conf: true} 
           },
           { loc: "Buffalo, NY", 
               t1: { s: 3, n: "Purdue", l: "teamlogos/ncaa/500/2509.png&h=200&w=200", conf: false}, 
               t2: { s: 14, n: "ETSU", l: "teamlogos/ncaa/500/2193.png&h=200&w=200", conf: true} 
           },
           { loc: "Philadelphia, PA", 
               t1: { s: 7, n: "Clemson", l: "teamlogos/ncaa/500/228.png&h=200&w=200", conf: false}, 
               t2: { s: 10, n: "Indiana", l: "teamlogos/ncaa/500/84.png&h=200&w=200", conf: false} 
           },
           { loc: "Philadelphia, PA", 
               t1: { s: 2, n: "UConn", l: "teamlogos/ncaa/500/41.png&h=200&w=200", conf: true}, 
               t2: { s: 15, n: "Wright St", l: "teamlogos/ncaa/500/2750.png&h=200&w=200", conf: true} 
           },
        ]
      },
      {
        name: "Midwest",
        site: "Chicago, IL",
        headerClass: "bg-midwest",
        games: [
           { loc: "Buffalo, NY", 
               t1: { s: 1, n: "Michigan", l: "teamlogos/ncaa/500/130.png&h=200&w=200", conf: true}, 
               t2: { s: 16, n: "Long Island/NJIT", l: "teamlogos/default-team-logo-500.png&h=72&w=72", conf: true} 
           },
           { loc: "Buffalo, NY", 
               t1: { s: 8, n: "UCF", l: "teamlogos/ncaa/500/2116.png&h=200&w=200", conf: false}, 
               t2: { s: 9, n: "Miami (FL)", l: "teamlogos/ncaa/500/2390.png&h=200&w=200", conf: false} 
           },
           { loc: "Tampa, FL", 
               t1: { s: 4, n: "Texas Tech", l: "teamlogos/ncaa/500/2641.png&h=200&w=200", conf: false}, 
               t2: { s: 13, n: "S.F. Austin", l: "teamlogos/ncaa/500/2617.png&h=200&w=200", conf: true} 
           },
           { loc: "Tampa, FL", 
               t1: { s: 5, n: "St. John's", l: "teamlogos/ncaa/500/2599.png&h=200&w=200", conf: false}, 
               t2: { s: 12, n: "Belmont", l: "teamlogos/ncaa/500/2057.png&h=200&w=200", conf: true} 
           },
           { loc: "Tampa, FL", 
               t1: { s: 6, n: "Saint Louis", l: "teamlogos/ncaa/500/139.png&h=200&w=200", conf: true}, 
               t2: { s: 11, n: "USC/Missouri", l: "teamlogos/default-team-logo-500.png&h=72&w=72", conf: false} 
           },
           { loc: "Tampa, FL", 
               t1: { s: 3, n: "Florida", l: "teamlogos/ncaa/500/57.png&h=200&w=200", conf: true}, 
               t2: { s: 14, n: "Cal Baptist", l: "teamlogos/ncaa/500/2856.png&h=200&w=200", conf: true} 
           },
           { loc: "St. Louis, MO", 
               t1: { s: 7, n: "Villanova", l: "teamlogos/ncaa/500/222.png&h=200&w=200", conf: false}, 
               t2: { s: 10, n: "UCLA", l: "teamlogos/ncaa/500/26.png&h=200&w=200", conf: false} 
           },
           { loc: "St. Louis, MO", 
               t1: { s: 2, n: "Iowa St", l: "teamlogos/ncaa/500/66.png&h=200&w=200", conf: false}, 
               t2: { s: 15, n: "Portland St", l: "teamlogos/ncaa/500/2502.png&h=200&w=200", conf: true} 
           },
        ]
      }
    ]
  },
  {
    id: "week17",
    title: "ARCHSTEPBOYZ <span>BRACKETOLOGY</span>",
    projectionDate: "FEB 23",
    // The Bubble Watch Data
    bubble: {
      last4In: [
        { name: "Indiana", logo: "teamlogos/ncaa/500/84.png&h=200&w=200" },
        { name: "USC", logo: "teamlogos/ncaa/500/30.png&h=200&w=200" },
        { name: "TCU", logo: "teamlogos/ncaa/500/2628.png&h=200&w=200" },
        { name: "Santa Clara", logo: "teamlogos/ncaa/500/2541.png&h=200&w=200" },
      ],
      first4Out: [
        { name: "Ohio St", logo: "teamlogos/ncaa/500/194.png&h=200&w=200" },
        { name: "New Mexico", logo: "teamlogos/ncaa/500/167.png&h=200&w=200" },
        { name: "San Diego St", logo: "teamlogos/ncaa/500/21.png&h=200&w=200" },
        { name: "VCU", logo: "teamlogos/ncaa/500/2670.png&h=200&w=200" },
      ],
      next4Out: [
        { name: "Virginia Tech", logo: "teamlogos/ncaa/500/259.png&h=200&w=200" },
        { name: "California", logo: "teamlogos/ncaa/500/25.png&h=200&w=200" },
      ]
    },
    // The 4 Regions. Order matters: [0]=South, [1]=West, [2]=East, [3]=Midwest
    regions: [
      {
        name: "South",
        site: "Houston, TX",
        headerClass: "bg-south",
        games: [
          { loc: "Philadelphia, PA", 
              t1: { s: 1, n: "UConn", l: "teamlogos/ncaa/500/41.png&h=200&w=200", conf: false}, 
              t2: { s: 16, n: "BCU/Howard", l: "teamlogos/default-team-logo-500.png&h=72&w=72", conf: true} 
          },
          { loc: "Philadelphia, PA", 
              t1: { s: 8, n: "NC State", l: "teamlogos/ncaa/500/152.png&h=200&w=200", conf: false}, 
              t2: { s: 9, n: "Texas A&M", l: "teamlogos/ncaa/500/245.png&h=200&w=200", conf: false} 
          },
          { loc: "Greenville, SC", 
              t1: { s: 4, n: "Texas Tech", l: "teamlogos/ncaa/500/2641.png&h=200&w=200", conf: false}, 
              t2: { s: 13, n: "High Point", l: "teamlogos/ncaa/500/2272.png&h=200&w=200", conf: true} 
          },
          { loc: "Greenville, SC", 
              t1: { s: 5, n: "N Carolina", l: "teamlogos/ncaa/500/153.png&h=200&w=200", conf: false}, 
              t2: { s: 12, n: "Yale", l: "teamlogos/ncaa/500/43.png&h=200&w=200", conf: true} 
          },
          { loc: "Oklahoma City, OK", 
              t1: { s: 6, n: "Kentucky", l: "teamlogos/ncaa/500/96.png&h=200&w=200", conf: false}, 
              t2: { s: 11, n: "Miami (OH)", l: "teamlogos/ncaa/500/193.png&h=200&w=200", conf: true} 
          },
          { loc: "Oklahoma City, OK", 
              t1: { s: 3, n: "Nebraska", l: "teamlogos/ncaa/500/158.png&h=200&w=200", conf: false}, 
              t2: { s: 14, n: "UC Irvine", l: "teamlogos/ncaa/500/300.png&h=200&w=200", conf: true} 
          },
          { loc: "St. Louis, MO", 
              t1: { s: 7, n: "Wisconsin", l: "teamlogos/ncaa/500/275.png&h=200&w=200", conf: false}, 
              t2: { s: 10, n: "Georgia", l: "teamlogos/ncaa/500/61.png&h=200&w=200", conf: false} 
          },
          { loc: "St. Louis, MO", 
              t1: { s: 2, n: "Iowa St", l: "teamlogos/ncaa/500/66.png&h=200&w=200", conf: false}, 
              t2: { s: 15, n: "Austin Peay", l: "teamlogos/ncaa/500/2046.png&h=200&w=200", conf: true} 
          },
        ]
      },
      {
        name: "West",
        site: "San Jose, CA",
        headerClass: "bg-west",
        games: [
          { loc: "San Diego, CA", 
              t1: { s: 1, n: "Arizona", l: "teamlogos/ncaa/500/12.png&h=200&w=200", conf: true}, 
              t2: { s: 16, n: "SEMO", l: "teamlogos/ncaa/500/2546.png&h=200&w=200", conf: true} 
          },
          { loc: "San Diego, CA", 
              t1: { s: 8, n: "Clemson", l: "teamlogos/ncaa/500/228.png&h=200&w=200", conf: false}, 
              t2: { s: 9, n: "Saint Mary's", l: "teamlogos/ncaa/500/2608.png&h=72&w=72", conf: false} 
          },
          { loc: "San Diego, CA", 
              t1: { s: 4, n: "Virginia", l: "teamlogos/ncaa/500/258.png&h=200&w=200", conf: false}, 
              t2: { s: 13, n: "N Dakota St", l: "teamlogos/ncaa/500/2449.png&h=72&w=72", conf: true} 
          },
          { loc: "San Diego, CA", 
              t1: { s: 5, n: "Arkansas", l: "teamlogos/ncaa/500/8.png&h=200&w=200", conf: false}, 
              t2: { s: 12, n: "S Florida", l: "teamlogos/ncaa/500/58.png&h=72&w=72", conf: true} 
          },
          { loc: "Portland, OR", 
              t1: { s: 6, n: "BYU", l: "teamlogos/ncaa/500/252.png&h=200&w=200", conf: false}, 
              t2: { s: 11, n: "Auburn", l: "teamlogos/ncaa/500/2.png&h=200&w=200", conf: false} 
          },
          { loc: "Portland, OR", 
              t1: { s: 3, n: "Gonzaga", l: "teamlogos/ncaa/500/2250.png&h=200&w=200", conf: true}, 
              t2: { s: 14, n: "App State", l: "teamlogos/ncaa/500/2026.png&h=72&w=72", conf: true} 
          },
          { loc: "Buffalo, NY", 
              t1: { s: 7, n: "Villanova", l: "teamlogos/ncaa/500/222.png&h=200&w=200", conf: false}, 
              t2: { s: 10, n: "Missouri", l: "teamlogos/ncaa/500/142.png&h=72&w=72", conf: false} 
          },
          { loc: "Buffalo, NY", 
              t1: { s: 2, n: "Purdue", l: "teamlogos/ncaa/500/2509.png&h=200&w=200", conf: false}, 
              t2: { s: 15, n: "Navy", l: "teamlogos/ncaa/500/2426.png&h=72&w=72", conf: true} 
          },
        ]
      },
      {
        name: "East",
        site: "Washington DC",
        headerClass: "bg-east",
        games: [
           { loc: "Greenville, SC", 
               t1: { s: 1, n: "Duke", l: "teamlogos/ncaa/500/150.png&h=200&w=200", conf: true}, 
               t2: { s: 16, n: "Merrimack", l: "teamlogos/ncaa/500/2771.png&h=200&w=200", conf: true} 
           },
           { loc: "Greenville, SC",
               t1: { s: 8, n: "Iowa", l: "teamlogos/ncaa/500/2294.png&h=200&w=200", conf: false}, 
               t2: { s: 9, n: "SMU", l: "teamlogos/ncaa/500/2567.png&h=200&w=200", conf: false} 
           },
           { loc: "Portland, OR", 
               t1: { s: 4, n: "Michigan St", l: "teamlogos/ncaa/500/127.png&h=200&w=200", conf: false}, 
               t2: { s: 13, n: "UNCW", l: "teamlogos/ncaa/500/350.png&h=200&w=200", conf: true} 
           },
           { loc: "Portland, OR", 
               t1: { s: 5, n: "Alabama", l: "teamlogos/ncaa/500/333.png&h=200&w=200", conf: false}, 
               t2: { s: 12, n: "Liberty", l: "teamlogos/ncaa/500/2335.png&h=200&w=200", conf: true} 
           },
           { loc: "Tampa, FL", 
               t1: { s: 6, n: "Tennessee", l: "teamlogos/ncaa/500/2633.png&h=200&w=200", conf: false}, 
               t2: { s: 11, n: "Indiana/Santa Clara", l: "teamlogos/default-team-logo-500.png&h=72&w=72", conf: false} 
           },
           { loc: "Tampa, FL", 
               t1: { s: 3, n: "Kansas", l: "teamlogos/ncaa/500/2305.png&h=200&w=200", conf: false}, 
               t2: { s: 14, n: "ETSU", l: "teamlogos/ncaa/500/2193.png&h=200&w=200", conf: true} 
           },
           { loc: "St. Louis, MO", 
               t1: { s: 7, n: "Utah St", l: "teamlogos/ncaa/500/328.png&h=200&w=200", conf: true}, 
               t2: { s: 10, n: "UCF", l: "teamlogos/ncaa/500/2116.png&h=200&w=200", conf: false} 
           },
           { loc: "St. Louis, MO", 
               t1: { s: 2, n: "Illinois", l: "teamlogos/ncaa/500/356.png&h=200&w=200", conf: false}, 
               t2: { s: 15, n: "Wright St", l: "teamlogos/ncaa/500/2750.png&h=200&w=200", conf: true} 
           },
        ]
      },
      {
        name: "Midwest",
        site: "Chicago, IL",
        headerClass: "bg-midwest",
        games: [
           { loc: "Philadelphia, PA", 
               t1: { s: 1, n: "Michigan", l: "teamlogos/ncaa/500/130.png&h=200&w=200", conf: true}, 
               t2: { s: 16, n: "Long Island/UMBC", l: "teamlogos/default-team-logo-500.png&h=72&w=72", conf: true} 
           },
           { loc: "Philadelphia, PA", 
               t1: { s: 8, n: "Miami (FL)", l: "teamlogos/ncaa/500/2390.png&h=200&w=200", conf: false}, 
               t2: { s: 9, n: "Texas", l: "teamlogos/ncaa/500/251.png&h=200&w=200", conf: false} 
           },
           { loc: "Buffalo, NY", 
               t1: { s: 4, n: "Vanderbilt", l: "teamlogos/ncaa/500/238.png&h=200&w=200", conf: false}, 
               t2: { s: 13, n: "S.F. Austin", l: "teamlogos/ncaa/500/2617.png&h=200&w=200", conf: true} 
           },
           { loc: "Buffalo, NY", 
               t1: { s: 5, n: "St. John's", l: "teamlogos/ncaa/500/2599.png&h=200&w=200", conf: true}, 
               t2: { s: 12, n: "Belmont", l: "teamlogos/ncaa/500/2057.png&h=200&w=200", conf: true} 
           },
           { loc: "Tampa, FL", 
               t1: { s: 6, n: "Louisville", l: "teamlogos/ncaa/500/97.png&h=200&w=200", conf: false }, 
               t2: { s: 11, n: "USC/TCU", l: "teamlogos/default-team-logo-500.png&h=72&w=72", conf: false} 
           },
           { loc: "Tampa, FL", 
               t1: { s: 3, n: "Florida", l: "teamlogos/ncaa/500/57.png&h=200&w=200", conf: true}, 
               t2: { s: 14, n: "Utah Valley", l: "teamlogos/ncaa/500/3084.png&h=200&w=200", conf: true} 
           },
           { loc: "Oklahoma City, OK", 
               t1: { s: 7, n: "Saint Louis", l: "teamlogos/ncaa/500/139.png&h=200&w=200", conf: true}, 
               t2: { s: 10, n: "UCLA", l: "teamlogos/ncaa/500/26.png&h=200&w=200", conf: false} 
           },
           { loc: "Oklahoma City, OK", 
               t1: { s: 2, n: "Houston", l: "teamlogos/ncaa/500/248.png&h=200&w=200", conf: false}, 
               t2: { s: 15, n: "Portland St", l: "teamlogos/ncaa/500/2502.png&h=200&w=200", conf: true} 
           },
        ]
      }
    ],
    // User picks by NCAA bracket round progression
    selections: {
      round64: [
        "UConn", "Texas A&M", "Texas Tech", "North Carolina", "Kentucky", "Nebraska", "Georgia", "Iowa St",
        "Arizona", "Saint Mary's", "Virginia", "Arkansas", "Auburn", "Gonzaga", "Villanova", "Purdue",
        "Duke", "Iowa", "Michigan St", "Alabama", "Tennessee", "Kansas", "UCF", "Illinois",
        "Michigan", "Miami (FL)", "Vanderbilt", "St. John's", "TCU", "Florida", "UCLA", "Houston"
      ],
      round32: [
        "UConn", "North Carolina", "Nebraska", "Iowa St", "Arizona", "Virginia", "Auburn", "Villanova",
        "Duke", "Michigan St", "Tennessee", "Illinois", "Michigan", "St. John's", "Florida", "Houston"
      ],
      sweet16: ["UConn", "Nebraska", "Arizona", "Auburn", "Duke", "Tennessee", "St. John's", "Houston"],
      elite8: ["Nebraska", "Arizona", "Duke", "Houston"],
      final4: ["Arizona", "Houston"],
      champion: "Houston"
    }
  },
];

// 2. THE RENDER FUNCTION
export function renderBracket(weekId) {
    const container = document.querySelector('.Bracket-Container');
    container.innerHTML = '';
    
    // A. Find the specific week data
    const data = mock_db_bracket.find(w => w.id === weekId);
    if (!data) return;
    
    // B. Helper: Create HTML for a single Region
    const createRegionHTML = (region) => {
        const gamesHTML = region.games.map(g => {
          let name1 = g.t1.n.split('/').map(nm => `<span class="team-name-12">${nm}</span>`).join('<span class="team-name-12"> / </span>');
          if (g.t1.conf) name1 += '<span class="bracket-note">*</span>';
          let name2 = g.t2.n.split('/').map(nm => `<span class="team-name-12">${nm}</span>`).join('<span class="team-name-12"> / </span>');
          if (g.t2.conf) name2 += '<span class="bracket-note">*</span>';
          return `
            <div class="matchup">
                <div class="team-row-12">
                    <span class="seed">${g.t1.s}</span>
                    <img src="https://secure.espncdn.com/combiner/i?img=/i/${g.t1.l}" class="logo">
                    <span class="team-name-12">${name1}</span>
                </div>
                <div class="team-row-12">
                    <span class="seed">${g.t2.s}</span>
                    <img src="https://secure.espncdn.com/combiner/i?img=/i/${g.t2.l}" class="logo">
                    <span class="team-name-12">${name2}</span>
                </div>
                <div class="game-location">${g.loc}</div>
            </div>
          `;}).join('');

        return `
            <div class="region-col">
                <div class="region-header ${region.headerClass}">
                    <span class="region-name">${region.name}</span>
                    <span class="region-site-top">${region.site}</span>
                </div>
                <div class="matchups-container">
                    ${gamesHTML}
                </div>
            </div>
        `;
    };

    // C. Helper: Create HTML for a Bubble Card
    const createBubbleListHTML = (teams, title, cssClass) => {
        const listItems = teams.map(t => `
            <li class="bubble-item">
                <img src="https://secure.espncdn.com/combiner/i?img=/i/${t.logo}" class="logo">
                ${t.name}
            </li>
        `).join('');

        return `
            <div class="bubble-card">
                <div class="bubble-header ${cssClass}">${title}</div>
                <ul class="bubble-list">${listItems}</ul>
            </div>
        `;
    };

    // D. Helper: Create HTML for User Selections Bracket
    const normalizeTeamName = (name = '') => {
        const cleaned = name.toLowerCase()
            .replace(/'/g, '')
            .replace(/&/g, ' and ')
            .replace(/[^a-z0-9/ ]+/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();

        const aliases = {
            "n carolina": "north carolina",
            "north carolina": "north carolina",
            "iowa st": "iowa state",
            "iowa state": "iowa state",
            "michigan st": "michigan state",
            "michigan state": "michigan state",
            "utah st": "utah state",
            "utah state": "utah state",
            "st johns": "saint johns",
            "saint johns": "saint johns",
            "st marys": "saint marys",
            "saint marys": "saint marys",
            "miami fl": "miami fl",
            "miami oh": "miami oh",
        };

        return aliases[cleaned] || cleaned;
    };

    const splitTeamAliases = (teamName = '') => teamName.split('/').map(name => name.trim()).filter(Boolean);

    const isPickedWinner = (pickedWinner = '', teamName = '') => {
        const picked = normalizeTeamName(pickedWinner);
        const options = splitTeamAliases(teamName).map(normalizeTeamName);
        return options.includes(picked);
    };

    const buildLogoLookup = (regions = []) => {
        const lookup = {};
        const registerTeam = (team) => {
            const logoSrc = `https://secure.espncdn.com/combiner/i?img=/i/${team.l}`;
            splitTeamAliases(team.n).forEach((alias) => {
                lookup[normalizeTeamName(alias)] = logoSrc;
            });
            lookup[normalizeTeamName(team.n)] = logoSrc;
        };

        regions.forEach((region) => {
            region.games.forEach((game) => {
                registerTeam(game.t1);
                registerTeam(game.t2);
            });
        });

        return lookup;
    };

    const getTeamLogo = (teamName, logoLookup) => {
        const fallbackLogo = "https://secure.espncdn.com/combiner/i?img=/i/teamlogos/default-team-logo-500.png&h=72&w=72";
        return logoLookup[normalizeTeamName(teamName)] || fallbackLogo;
    };

    const createSelectionTeamRowHTML = (team, pickedWinner, logoLookup, sideClass) => `
        <div class="selection-game-team ${isPickedWinner(pickedWinner, team.n) ? 'is-picked' : ''} ${sideClass === 'right' ? 'is-right' : ''}">
            <span class="selection-seed">${team.s ?? ''}</span>
            <img src="${getTeamLogo(team.n, logoLookup)}" class="selection-logo" alt="${team.n}">
            <span class="selection-team-text">${team.n}</span>
        </div>
    `;

    const createSelectionWinnerPillHTML = (teamName, logoLookup, sideClass) => `
        <div class="selection-winner-pill ${sideClass === 'right' ? 'is-right' : ''}">
            <img src="${getTeamLogo(teamName, logoLookup)}" class="selection-logo" alt="${teamName}">
            <span class="selection-team-text">${teamName}</span>
        </div>
    `;

    const createRound64ColumnHTML = (games, pickedWinners, logoLookup, sideClass) => {
        const gameCards = games.map((game, index) => {
            const pickedWinner = pickedWinners[index] || "";
            return `
                <div class="selection-game-card">
                    ${createSelectionTeamRowHTML(game.t1, pickedWinner, logoLookup, sideClass)}
                    ${createSelectionTeamRowHTML(game.t2, pickedWinner, logoLookup, sideClass)}
                </div>
            `;
        }).join('');

        return `
            <div class="selection-round selection-round-64">
                <div class="selection-round-title">Round of 64</div>
                <div class="selection-round-games">${gameCards}</div>
            </div>
        `;
    };

    const createWinnerRoundColumnHTML = (title, teams, logoLookup, sideClass, roundClass) => `
        <div class="selection-round ${roundClass}">
            <div class="selection-round-title">${title}</div>
            <div class="selection-winner-list">
                ${teams.map(teamName => createSelectionWinnerPillHTML(teamName, logoLookup, sideClass)).join('')}
            </div>
        </div>
    `;

    const createSelectionSideColumnsHTML = (sideData, sideClass, logoLookup) => {
        const round64 = createRound64ColumnHTML(sideData.games, sideData.round64, logoLookup, sideClass);
        const round32 = createWinnerRoundColumnHTML("Round of 32", sideData.round32, logoLookup, sideClass, "selection-round-32");
        const sweet16 = createWinnerRoundColumnHTML("Sweet 16", sideData.sweet16, logoLookup, sideClass, "selection-round-16");
        const elite8 = createWinnerRoundColumnHTML("Elite 8", sideData.elite8, logoLookup, sideClass, "selection-round-8");

        return sideClass === 'left'
            ? `${round64}${round32}${sweet16}${elite8}`
            : `${elite8}${sweet16}${round32}${round64}`;
    };

    const createSelectionsBracketHTML = (selectionData) => {
        if (!selectionData) return '';

        const logoLookup = buildLogoLookup(data.regions);

        const leftRegions = data.regions.slice(0, 2);
        const rightRegions = data.regions.slice(2, 4);

        const leftGames = leftRegions.flatMap(region => region.games);
        const rightGames = rightRegions.flatMap(region => region.games);

        const leftSide = {
            title: `${leftRegions[0].name} + ${leftRegions[1].name}`,
            games: leftGames,
            round64: (selectionData.round64 || []).slice(0, leftGames.length),
            round32: (selectionData.round32 || []).slice(0, 8),
            sweet16: (selectionData.sweet16 || []).slice(0, 4),
            elite8: (selectionData.elite8 || []).slice(0, 2),
        };

        const rightSide = {
            title: `${rightRegions[0].name} + ${rightRegions[1].name}`,
            games: rightGames,
            round64: (selectionData.round64 || []).slice(leftGames.length, leftGames.length + rightGames.length),
            round32: (selectionData.round32 || []).slice(8, 16),
            sweet16: (selectionData.sweet16 || []).slice(4, 8),
            elite8: (selectionData.elite8 || []).slice(2, 4),
        };

        const finalFour = selectionData.final4 || [];
        const champion = selectionData.champion || '';

        return `
            <section class="selection-bracket-section">
                <div class="selection-bracket-header">
                    <h2>Week 17 Selections</h2>
                    <p class="selection-bracket-subtitle">NCAA format: 32 game winners per side into the Final Four</p>
                </div>
                <div class="selection-bracket-layout">
                    <div class="selection-side-block">
                        <div class="selection-side-title">Left Side · ${leftSide.title} (32 Teams)</div>
                        <div class="selection-side is-left">
                            ${createSelectionSideColumnsHTML(leftSide, 'left', logoLookup)}
                        </div>
                    </div>

                    <div class="selection-center-column">
                        <div class="selection-round-title">Final Four</div>
                        <div class="selection-final-four-list">
                            ${finalFour.map(teamName => `
                                <div class="selection-finalist-card">
                                    <img src="${getTeamLogo(teamName, logoLookup)}" class="selection-logo" alt="${teamName}">
                                    <span class="selection-team-text">${teamName}</span>
                                </div>
                            `).join('')}
                        </div>
                        <div class="selection-round-title">Champion</div>
                        <div class="selection-champion-card">
                            <i class="fa-solid fa-trophy"></i>
                            <img src="${getTeamLogo(champion, logoLookup)}" class="selection-logo" alt="${champion}">
                            <span class="selection-team-text">${champion}</span>
                        </div>
                    </div>

                    <div class="selection-side-block">
                        <div class="selection-side-title">Right Side · ${rightSide.title} (32 Teams)</div>
                        <div class="selection-side is-right">
                            ${createSelectionSideColumnsHTML(rightSide, 'right', logoLookup)}
                        </div>
                    </div>
                </div>
            </section>
        `;
    };

    // D. Build the Full HTML String
    const htmlStructure = `
        <div class="header-12">
            <h1>${data.title}</h1>
            <div style="font-size: 0.8rem; opacity: 0.8;">PROJECTION: ${data.projectionDate}</div>
        </div>
        <div class="Bracket-Container-12">
            ${createRegionHTML(data.regions[0])} ${createRegionHTML(data.regions[1])} <div class="bubble-col">
                ${createBubbleListHTML(data.bubble.last4In, "Last 4 In", "bubble-safe")}
                ${createBubbleListHTML(data.bubble.first4Out, "First 4 Out", "bubble-edge")}
                ${createBubbleListHTML(data.bubble.next4Out, "Bubble", "bubble-danger")}
            </div>

            ${createRegionHTML(data.regions[2])} ${createRegionHTML(data.regions[3])} </div>
        ${createSelectionsBracketHTML(data.selections)}
    `;

    // E. Inject into DOM
    container.innerHTML = htmlStructure;
}
