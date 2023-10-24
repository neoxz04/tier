const input = document.querySelector('#input');
const output = document.querySelector('#output');

input.addEventListener('input', update);

function update(event) {
  let key;
  let value;
  let isGearSection = false;
  let gear = new Map();

  output.value = 'ptr=1\n\n';

  for (let line of input.value.split('\n')) {
    if (line.startsWith('#') || line.trim() == '') continue;

    [key, value] = getKeyValue(line);
    if (key == 'head') isGearSection = true;
    if (isGearSection) {
      gear.set(key, value);
    } else {
      output.value += line + '\n';
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
set_bonus=tier30_2pc=1
set_bonus=tier30_4pc=0
set_bonus=tier31_2pc=1
set_bonus=tier31_4pc=0
`;
        break;
      case 't31':
        result += `
copy="t31_4p ${level}"
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