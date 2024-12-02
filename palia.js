const PROPORTION_GOLD_CROPS = 0.15;
const GOLD_SELL_MULTIPLIER = 1.5;

const avgSellPrice = (sellPrice) =>
  sellPrice * (1 - PROPORTION_GOLD_CROPS) +
  sellPrice * GOLD_SELL_MULTIPLIER * PROPORTION_GOLD_CROPS;

const valuePerDay = (sellPrice, growthRateDays) =>
  avgSellPrice(sellPrice) / growthRateDays;

const percentageOfCropThatMustBeConvertedToSeed = (
  seedTimeInMinutes,
  growthRateDays,
  cropsNeededPerSeed,
  cropsProducedPerSeed
) => {
  /**
   * Say a seed takes 1 crop to make, has 4x output, and takes 1 day.
   * So every 1 day you get a (4x - 1) return.
   *
   * Essentially we need to know, what percentage of your crop do you need to convert to seed,
   * in order to cover your crop cycle.
   * Does that depend on the size of your field? It.. shouldn't...
   * But it should depend on crop growth rate...
   *
   * If I have 9 plants, with growth rate of 2 days...
   * Then I need to make 9 seeds every 2 days. Ok.
   * So how LONG does it take me to do that, given my output and time taken?
   * And then, how much input.
   */

  const NUM_MINUTES_IN_ONE_DAY = 60 * 24;

  /**
   * So if growth rate is 4 days..
   * And seeds create in 2 days..
   *
   * Then seedsNeededPerDay is 1/4.
   * And seedsCreatedPerDay is 1/2.
   *
   *
   * Ok great, so I only need to produce 1/4 / 1/2 = 1/2 as many seeds.
   * That means I can multiply my seed input by that mount.
   *
   * So for ex... growthRate is 4 days.
   * Seeds take 2 days. They require 1 crop, and produce 4.
   * So seedsNeededPerDay is 1/4.
   * And seedsCreatedPerDay is 4 * (1/2) = 2.
   * So we need only 1/8 inputs.
   * And each input needs 1 crop, so we need 1/8 crops.
   */

  // How many seeds we need to create every day to compensate for crop's growth rate
  const seedsNeededPerDay = 1 / growthRateDays;
  // How many seeds we can create in a day, given seed's creation rate
  // Oh but also account for fact that we can produce multiple seeds per crop..
  // If I produce more, I should create more seeds per day...
  const seedsCreatedPerDay =
    cropsProducedPerSeed * (NUM_MINUTES_IN_ONE_DAY / seedTimeInMinutes);
  // How many inputs we need...
  const inputsNeeded = seedsNeededPerDay / seedsCreatedPerDay;
  const cropsNeededProportion = cropsNeededPerSeed * inputsNeeded;

  //   return { cropsNeeded, seedsNeededPerDay, seedsCreatedPerDay, inputsNeeded };
  return cropsNeededProportion;
};

// Just valuePerDay * (1 - percentageOfCropThatMustBeConvertedToSeed)
const totalCropValue = (conversionInfo, sellPrice) => {
  const {
    seedTimeInMinutes,
    growthRateDays,
    cropsNeededPerSeed,
    cropsProducedPerSeed,
  } = conversionInfo;

  //   console.log("vpd", sellPrice, valuePerDay(sellPrice));
  return (
    valuePerDay(sellPrice, growthRateDays) *
    (1 -
      24 *
        percentageOfCropThatMustBeConvertedToSeed(
          seedTimeInMinutes,
          growthRateDays,
          cropsNeededPerSeed,
          cropsProducedPerSeed
        ))
  );
};

const crops = [
  { name: "carrot", raw: [15, 3, 7, 1, 18, 4] },
  { name: "onion", raw: [20, 4, 10, 1, 24, 2] },
  { name: "potato", raw: [40, 5, 20, 1, 84, 4] },
  { name: "cotton", raw: [40, 50, 20, 1, 36, 3] },
  { name: "tomato", raw: [80, 4, 40, 3, 30, 2] },
  { name: "wheat", raw: [25, 4, 12, 1, 42, 4] },
  { name: "rice", raw: [23, 3, 11, 1, 42, 4] },
  { name: "corn", raw: [30, 5, 15, 1, 48, 4] },
];

crops.forEach((crop, idx) => {
  const obj = {};
  crop.raw.forEach((val, idx) => {
    if (idx === 1) obj.growthRateDays = val;
    if (idx === 2) obj.sellPrice = val;
    if (idx === 3) obj.cropsNeededPerSeed = val;
    if (idx === 4) obj.seedTimeInMinutes = val;
    if (idx === 5) obj.cropsProducedPerSeed = val;
  });
  crops[idx] = { ...crop, ...obj };
});

console.log(crops);

// Huh.... so totalCropValue is essentially same as valuePerDay.... interesting......
// Must be because percentageOfCropThatMustBeConvertedToSeed comes back so small.......
// OOOOOOH AM I NOT CONVERITNG BETWEEN A "DAY" IN GAME TIME AND "MINUTES" IN REAL LIFE????? LOLLLLLLL
// Yeah when we scale that percentage by 24 we get what feel like better numbers..... but not sure...

// In any case: potato & tomato look like the stand outs.

crops.forEach((crop) => {
  console.log(
    `${crop.name} has value ${totalCropValue(
      crop,
      crop.sellPrice
    )}, sells for ${valuePerDay(crop.sellPrice, crop.growthRateDays)}`
  );
});
// Ugh I could just like Monte Carlo it.... because I'm struggling to figure out the theory....

// Oooh shit and then tomatoes give you extra harvest.......

// console.log(percentageOfCropThatMustBeConvertedToSeed(2 * 60 * 24, 4, 1, 4));

// Ok I think we have the theory...

// Just this weird quirk about tomatoes... Hm.....
// I wonder if we could almost just canel their extra 3-crop-cost-per-seed..... because they get 3x value.... IDk lol
// But it also still has lower output by 1/2 than everyone else.... so it's multi-handicapped for the seed maker...
