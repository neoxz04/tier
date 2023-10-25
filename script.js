const input = document.querySelector('#input');
const output = document.querySelector('#output');

input.addEventListener('input', update);
for (let inputElement of document.querySelectorAll('input')) {
  inputElement.addEventListener('focus',
      event => event.target.select());
  inputElement.addEventListener('input', update);
}

function update(event) {
  let key;
  let value;
  let inputTalent;
  let isFirstLine = true;
  let isGearSection = false;
  const tierNames = ['t30', 'both_2p', 't31_2p', 't31'];
  const gear = new Map();

  output.value = 'ptr=1\n\n';

  // Parse input
  for (let line of input.value.split('\n')) {
    if (line.startsWith('#') || line.trim() == '') continue;

    [key, value] = getKeyValue(line);
    if (isFirstLine) {
      isFirstLine = false;
      value = `"${
        value.slice(1, value.length-1)} t30 4p"`;
    }
    if (key == 'talents') inputTalent = value;
    if (key == 'head') isGearSection = true;
    if (isGearSection) {
      gear.set(key, value);
    } else if (key != 'talents') {
      output.value += `${key}=${value}\n`;
    }
  }

  // Populate talents
  let talents = getTalentsFromCookie();
  for (let tier of tierNames) {
    const inputElement = document.querySelector(`#${tier}`);
    const inputValue = inputElement.value.trim();
    if (inputValue) {
      talents.set(tier, inputValue);
    } else if (talents.has(tier)) {
      inputElement.value = talents.get(tier);
    } else {
      talents.set(tier, inputTalent);
      inputElement.value = inputTalent;
    }
    inputElement.style.color =
        (talents.get(tier) == inputTalent) ? 'grey' : 'black';
  }
  document.cookie = `talents=${
      JSON.stringify(Array.from(talents.entries()))}; max-time=${60*60*24*180}`;

  // Write copies
  for (let tier of tierNames) {
    output.value += getTierString(tier);
  }

  function getTalentsFromCookie() {
    const prefix = 'talents='
    let talents = document.cookie
        .split("; ")
        .find(value => value.startsWith(prefix));
    return talents
        ? new Map(JSON.parse(talents.slice(prefix.length)))
        : new Map();
  }

  function getTierString(tier) {
    const level = 470;
    const altLevel = 447;
    let tierSlots = [];
    let result = '';

    switch (tier) {
      case 't30':
        tierSlots = ['shoulder', 'hands', 'chest', 'legs'];
        result += `
set_bonus=tier30_2pc=1
set_bonus=tier30_4pc=1
set_bonus=tier31_2pc=0
set_bonus=tier31_4pc=0
`;
        break;
      case 'both_2p':
        tierSlots = ['shoulder', 'hands'];
        result += `
copy="2p_2p"

set_bonus=tier30_2pc=1
set_bonus=tier30_4pc=0
set_bonus=tier31_2pc=1
set_bonus=tier31_4pc=0
`;
        break;
      case 't31':
        result += `
copy="t31_4p"

set_bonus=tier30_2pc=0
set_bonus=tier30_4pc=0
set_bonus=tier31_2pc=1
set_bonus=tier31_4pc=1
`;
        break;
      case 't31_2p':
        result += `
copy="t31_2p"

set_bonus=tier30_2pc=0
set_bonus=tier30_4pc=0
set_bonus=tier31_2pc=1
set_bonus=tier31_4pc=0
`;
        break;
    }

    result += `\ntalents=${talents.get(tier)}\n\n`;
    for (const [key, value] of gear) {
      result += `${key}=${value},ilevel=${
        tierSlots.includes(key) ? altLevel : level}\n`;
    }

    return result;
  }

  function getKeyValue(line) {
    index = line.indexOf('=');
    return [line.slice(0, index), line.slice(index + 1)];
  }
}