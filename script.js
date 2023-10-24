const input = document.querySelector('#input');
const output = document.querySelector('#output');

input.addEventListener('input', update);

function update(event) {
  let key;
  let value;
  let talents;
  let isFirstLine = true;
  let isGearSection = false;
  let gear = new Map();

  output.value = 'ptr=1\n\n';

  for (let line of input.value.split('\n')) {
    if (line.startsWith('#') || line.trim() == '') continue;

    [key, value] = getKeyValue(line);
    if (isFirstLine) {
      isFirstLine = false;
      value = `"${
        value.slice(1, value.length-1)} t30 4p 470/447"`;
    }
    if (key == 'talents') talents = value;
    if (key == 'head') isGearSection = true;
    if (isGearSection) {
      gear.set(key, value);
    } else {
      output.value += `${key}=${value}\n`;
    }
  }

  output.value += getTierString('t30');
  output.value += getTierString('2p2p');
  output.value += getTierString('t31');

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
      case '2p2p':
        tierSlots = ['shoulder', 'hands'];
        result += `
copy="2p_2p ${level}/${altLevel}"

# Talents copied from your input, manually change it if 2p 2p uses a different build
talents=${talents}

set_bonus=tier30_2pc=1
set_bonus=tier30_4pc=0
set_bonus=tier31_2pc=1
set_bonus=tier31_4pc=0
`;
        break;
      case 't31':
        result += `
copy="t31_4p ${level}"

# Talents copied from your input, manually change it if t31 4p uses a different build
talents=${talents}

set_bonus=tier30_2pc=0
set_bonus=tier30_4pc=0
set_bonus=tier31_2pc=1
set_bonus=tier31_4pc=1
`;
        break;
    }

    result += '\n';
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