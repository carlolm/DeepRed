const knex = require('knex')(require('../knexfile'));

const newGame = (game) => {
  if (game.color == 'white') {
    knex.insert({
      session_id: game.session_id,
      white: game.display,
      black: null,
      result: null,
      turns: 0,
    }).into('games').then((res) => {
      console.log(res);
    });
  } else {
    knex.insert({
      session_id: game.session_id,
      white: null,
      black: game.display,
      result: null,
      turns: 0,
    }).into('games').then((res) => {
      console.log(res);
    });
  }
};

const joinGame = (game) => {
  if (game.color == 'black') {
    knex('games').where({ session_id: game.session_id }).update({
      black: game.display,
    }).then((res) => {
      console.log(res);
    });
  } else {
    knex('games').where({ session_id: game.session_id }).update({
      white: game.display,
    }).then((res) => {
       console.log(res);
    });
  }
};

// // game = {
// //   session_id: 32155,
// //   history: 'string of history'
     // black_pieces: '',
     // white_pieces: '',
// // }

const saveMove = (game) => {
  knex('games').where({ session_id: game.session_id })
    .increment('turns', 1)
    .then((res) =>
      console.log(res)
   );

  knex('games').where({ session_id: game.session_id }).update({
    history: game.history,
    black_pieces: game.black_pieces,
    white_pieces: game.white_pieces
  }).then((res) =>
      console.log(res)
   );
}


// // game = {
// //   session_id: 'session_id'
// //   result: 'name/name2' || 'draw'
// //   white: 'name',
// //   black: 'name2',
// // }


const finishGame = (game) => {
  if (game.result == 'draw'){
    knex('games').where({session_id: game.session_id}).update({
      result: 'Draw'
    }).then((res) => 
      console.log(res)
    );

    knex('profiles').where({display: game.white}).increment('draw', 1)
    .then((res) => 
      console.log(res)
    );

    knex('profiles').where({display: game.black}).increment('draw', 1)
    .then((res) => 
      console.log(res)
    );

    knex('profiles').where({ display: game.white }).increment('total_games', 1)
    .then((res) =>
      console.log(res)
    );

    knex('profiles').where({ display: game.black }).increment('total_games', 1)
    .then((res) =>
      console.log(res)
    );

  } else if (game.result == game.white) {

    knex('games').where({session_id: game.session_id}).update({
      result: game.result
    }).then((res) => 
      console.log(res)
    );

    knex('profiles').where({display: game.result}).increment('win', 1)
    .then((res) => 
      console.log(res)
    );

    knex('profiles').where({ display: game.black }).increment('loss', 1)
    .then((res) =>
      console.log(res)
    );

    knex('profiles').where({ display: game.white }).increment('total_games', 1)
    .then((res) =>
      console.log(res)
    );

    knex('profiles').where({ display: game.black }).increment('total_games', 1)
    .then((res) =>
      console.log(res)
    );
  } else {

    knex('games').where({session_id: game.session_id}).update({
      result: game.result
    }).then((res) => 
      console.log(res)
    );

    knex('profiles').where({display: game.result}).increment('win', 1)
    .then((res) =>
      console.log(res)
    );

    knex('profiles').where({ display: game.white }).increment('loss', 1)
    .then((res) =>
      console.log(res)
    );

    knex('profiles').where({ display: game.white }).increment('total_games', 1)
    .then((res) =>
      console.log(res)
    );

    knex('profiles').where({ display: game.black }).increment('total_games', 1)
    .then((res) =>
      console.log(res)
    );

  }
};





const requestClient = (user) => {
  knex('profiles').where('display', user.display).then((res) =>
     console.log(res[0])
  );
};

const requestGame = (game) => {
  knex('games').where('session_id', game.session_id).then((res) =>
     console.log(res[0])
  );
};

const requestHistory = (game) => {
  knex('games').where('session_id', game.session_id).then((res) =>
     console.log(res[0].history)
  );
};

const requestWhitePieces = (game) => {
  knex('games').where('session_id', game.session_id).then((res) =>
     console.log(res[0].white_pieces)
  );
};

const requestBlackPieces = (game) => {
  knex('games').where('session_id', game.session_id).then((res) =>
     console.log(res[0].black_pieces)
  );
};

module.exports.newGame = newGame;
module.exports.joinGame = joinGame;
// module.exports = saveMove;
// module.exports = finishGame;
// module.exports = requestClient;
// module.exports = requestGame;
// module.exports = requestHistory;
// module.exports = requestWhitePieces;
// module.exports = requestBlackPieces;

