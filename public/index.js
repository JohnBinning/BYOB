const clearTarget = () => {
  $('#target').html('');
}

$('.franchises').on('click', () => {
  fetch('/api/v1/franchises')
  .then((res) => res.json())
  .then((franchises) => {
    clearTarget();
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
    people.forEach((person) => {
      let { name, career, induction_method, position } = person;
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
    batters.forEach((batter) => {
      let { name, avg, hits, hr, obp, rbi, runs, slg, sb } = batter;
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
    console.log(pitchers)
    clearTarget();  
    pitchers.forEach((pitcher) => {
      let { name, games, starts, era, wins, losses, strikeouts, walks } = pitcher;
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