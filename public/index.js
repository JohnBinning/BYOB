const clearTarget = () => {
  $('#target').html('');
}

let shown = false;

const show = () => {
  $('#burns').html(`"It is played everywhere. In parks and playgrounds and prison yards. 
      In back alleys and farmers fields. By small children and by old men. 
      By raw amateurs and millionare professionals. It is a leisurely game that demands blinding speed. 
      The only game where the defense has the ball. It follows the seasons, beginning each year with the fond expectancy of springtime and ending with the hard facts of autumn. 
      Americans have played baseball for more than 200 years, while they conquered a continent, 
      warred with one another and with enemies abroad, struggled over labor and civil rights, and the meaning of freedom.
      At the game's heart lie mythic contradictions: a pastoral game, born in crowded cities; 
      an exhilarating democratic sport that tolerates cheating; and it has excluded as many as it has included; 
      a profoundly conservative game that sometimes manages to be years ahead of its time. 
      It is an American odyssey that links sons and daughters to fathers and grandfathers. 
      And it reflects a host of age-old American tensions: between workers and owners, scandal and reform, 
      the individual and the collective. It is a haunted game, where each player is measured by the ghosts of those who have gone before. 
      Most of all, it is about time and timelessness; speed and grace; failure and loss; imperishable hope; and coming home." <em> -Ken Burns</em>`);
  $('#show').html('Collapse');
}

const hide = () => {
  $('#burns').html(`"It is played everywhere. In parks and playgrounds and prison yards. 
      In back alleys and farmers fields. By small children and by old men. 
      By raw amateurs and millionare professionals... 
      <em> -Ken Burns</em>`);
  $('#show').html('Expand');
}

const handleQuoteVis = () => {
  shown ? hide() : show();
  shown = !shown;
}

$('#quote').on('click', () => {
  handleQuoteVis();
})

$('.franchises').on('click', () => {
  fetch('/api/v1/franchises')
  .then((res) => res.json())
  .then((franchises) => {
    clearTarget();
    $('#target').prepend('<h2>Franchises:</h2>');
    franchises.forEach((franch) => {
      let { franch_name, franch_id, active, league } = franch;
      if (!league) league = 'No Data';
      $('#target').append(`
      <article class='card'>
        <div>Name: ${franch_name}</div>
        <div>ID: ${franch_id}</div>
        <div>Active: ${active}</div>
        <div>League: ${league}</div> 
      <article>
      `);
    })
  })
})

$('.people').on('click', () => {
  fetch('/api/v1/inducted_people')
  .then((res) => res.json())
  .then((people) => {
    clearTarget();  
    $('#target').prepend('<h2>People:</h2>');
    people.forEach((person) => {
      const { name, career, induction_method, position } = person;
      $('#target').append(`
      <article class='card'>
        <div>Name: ${name}</div>
        <div>Career: ${career}</div>
        <div>Position: ${position}</div>
        <div>Induction method: ${induction_method}</div> 
      <article>
      `);
    })
  })
})

$('.batters').on('click', () => {
  fetch('/api/v1/batter_data')
  .then((res) => res.json())
  .then((batters) => {
    clearTarget();  
    $('#target').prepend('<h2>Batters:</h2>');
    batters.forEach((batter) => {
      const { name, avg, hits, hr, obp, rbi, runs, slg, sb } = batter;
      const ops = Number(obp) + Number(slg);
      $('#target').append(`
      <article class='card'>
        <div>Name: ${name}</div>
        <div>Average: ${avg}</div>
        <div>Hits: ${hits}</div>
        <div>Home Runs: ${hr}</div> 
        <div>OBP: ${obp}</div> 
        <div>SLG: ${slg}</div> 
        <div>OPS: ${ops.toString().slice(1, 5)}</div> 
        <div>RBI: ${rbi}</div> 
        <div>Runs: ${runs}</div> 
        <div>SB: ${sb}</div> 
      <article>
      `);
    })
  })
})

$('.pitchers').on('click', () => {
  fetch('/api/v1/pitcher_data')
  .then((res) => res.json())
  .then((pitchers) => {
    clearTarget();  
    $('#target').prepend('<h2>Pitchers:</h2>');
    pitchers.forEach((pitcher) => {
      const { name, games, starts, era, wins, losses, strikeouts, walks } = pitcher;
      $('#target').append(`
      <article class='card'>
        <div>Name: ${name}</div>
        <div>Games: ${games}</div>
        <div>Starts: ${starts}</div>
        <div>Wins: ${wins}</div>
        <div>Losses: ${losses}</div>
        <div>ERA: ${era}</div>
        <div>Strikeouts: ${strikeouts}</div>
        <div>Walks: ${walks}</div>
      <article>
      `);
    })
  })
})