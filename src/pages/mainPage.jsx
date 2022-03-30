import React, {Fragment, useEffect, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import {Box} from '@mui/system';
import {Button, Divider, Typography} from '@mui/material';

const MainPage = () => {
  return (
    <Fragment>
      <Box
        component='header'
        sx={{
          marginBlock: '0.5rem',
        }}
      >
        <Typography variant='h5' align='center'>
            Find Different Colors
        </Typography>
      </Box>
      <Box
        component='main'
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          height: '100%',
        }}
      >
        <Game/>
      </Box>
    </Fragment>
  );
};

export default MainPage;

const GameState = {
  menu: 'menu',
  playing: 'playing',
  result: 'result',
  introduce: 'introduce',
};

const Game = () => {
  const [gameState, setGameState] = useState(GameState.menu);
  const [currentLevel, setCurrentLevel] = useState(1);
  let content;
  switch (gameState) {
    case GameState.menu:
      content = (
        <Menu
          onStartButtonClick={()=>{
            setGameState(GameState.playing);
            setCurrentLevel(1);
          }}
          onHowToPlayButtonClick={()=>{
            setGameState(GameState.introduce);
          }}
        />
      );
      break;
    case GameState.introduce:
      content = (
        <Introduce onBackButtonClick={()=>{
          setGameState(GameState.menu);
        }}/>
      );
      break;
    case GameState.playing:
      content = (
        <Fragment>
          <Timer
            time={60}
            onTimeEnd={()=>{
              setGameState(GameState.result);
            }}
          />
          <ColorFinder
            startLevel={1}
            onLevelUpdate={(newLevel)=>{
              setCurrentLevel(newLevel);
            }}
          />
          <Typography variant='h5' align='center'>
              Level: {currentLevel}
          </Typography>
        </Fragment>
      );
      break;
    case GameState.result:
      content = (
        <Result
          reachedLevel={currentLevel}
          onGameRestartButtonClick={()=>{
            setGameState(GameState.playing);
            setCurrentLevel(1);
          }}
          onBackToMenuButtonClick={()=>{
            setGameState(GameState.menu);
          }}
        />
      );
      break;
  }
  return (
    <Fragment>
      {content}
    </Fragment>
  );
};

const Menu = (props) => {
  const {onStartButtonClick, onHowToPlayButtonClick} = props;
  const handleStartButtonClick = () => {
    onStartButtonClick();
  };
  const handleHowToPlayButtonClick = () => {
    onHowToPlayButtonClick();
  };
  return (
    <Fragment>
      <Button
        variant='contained'
        color='primary'
        onClick={handleStartButtonClick}
      >
        Game Start
      </Button>
      <Divider/>
      <Button
        variant='contained'
        color='info'
        onClick={handleHowToPlayButtonClick}
      >
        How to play?
      </Button>
    </Fragment>
  );
};

Menu.propTypes = {
  onStartButtonClick: PropTypes.func,
  onHowToPlayButtonClick: PropTypes.func,
};

const Introduce = (props) => {
  const {onBackButtonClick} = props;
  const handleBackButtonClick = () => {
    onBackButtonClick();
  };
  return (
    <Fragment>
      <Typography
        align='center'
        sx={{
          marginBlock: '0.5rem',
        }}
      >
        Reach as high a level as possible within 60 seconds,
        when the level is higher, the number of blocks and
        the difference in color will become larger and larger.
        <br/>
        <br/>
        Keep your eyes clear enough, good luck :)
      </Typography>
      <Button variant='contained' onClick={handleBackButtonClick}>
        Back to menu
      </Button>
    </Fragment>
  );
};

Introduce.propTypes = {
  onBackButtonClick: PropTypes.func,
};

const Timer = (props) => {
  const {time, onTimeEnd} = props;
  const [remainTime, setRemainTime] = useState(time);

  useEffect(()=>{
    setTimeout(()=>{
      countDown();
    }, 1000);
  }, [remainTime]);

  const countDown = () => {
    if (remainTime > 0) {
      setRemainTime(remainTime - 1);
    } else {
      onTimeEnd();
    }
  };

  return (
    <Typography variant='h5' align='center'>
      Time: {remainTime}
    </Typography>
  );
};

Timer.propTypes = {
  time: PropTypes.number.isRequired,
  onTimeEnd: PropTypes.func.isRequired,
};

const ColorFinder = (props) => {
  const {startLevel, onLevelUpdate} = props;

  const [level, setLevel] = useState(startLevel);

  const getSize = () => {
    return Math.floor((level - 1) / 5) + 2;
  };
  const size = getSize();
  const getRandomPosition = () => {
    return [
      Math.floor(Math.random() * size),
      Math.floor(Math.random() * size),
    ];
  };
  const [answerPosition, setAnswerPosition] = useState(getRandomPosition());

  const gameFrameRef = useRef(null);
  const squareRef = useRef(null);

  useEffect(()=>{
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleResize = () => {
    const size = Math.min(
        gameFrameRef.current.offsetWidth,
        gameFrameRef.current.offsetHeight );
    squareRef.current.style.width = size + 'px';
    squareRef.current.style.height = size + 'px';
  };

  const getRandomColor = () => {
    return {
      r: Math.random() * 255,
      g: Math.random() * 255,
      b: Math.random() * 255,
    };
  };

  const questionColor = getRandomColor();

  const generateAnswerColor = () => {
    const randomSign = Math.random() - 0.5 < 0? -1: 1;
    const FINAL_LEVEL = 60;
    const MAX_DIFF = 40;
    const diffrence = randomSign * Math.max(5,
        MAX_DIFF / FINAL_LEVEL * (FINAL_LEVEL - level));

    const rWeight = Math.random();
    const gWeight = Math.random();
    const bWeight = Math.random();
    const weightSum = rWeight + gWeight + bWeight;

    return {
      r: questionColor.r + rWeight / weightSum * diffrence,
      g: questionColor.g + gWeight / weightSum * diffrence,
      b: questionColor.b + bWeight / weightSum * diffrence,
    };
  };

  const answerColor = generateAnswerColor();

  const handleBlockClick = (position) => {
    if (position[0] === answerPosition[0] &&
        position[1] === answerPosition[1]) {
      const newLevel = level + 1;
      setLevel(newLevel);
      onLevelUpdate(newLevel);
      setAnswerPosition(getRandomPosition());
    }
  };

  const rows = [];

  for (let i = 0; i < size; i++) {
    const clomns = [];
    for (let j = 0; j < size; j++) {
      const color = i === answerPosition[0] && j === answerPosition[1]?
      answerColor: questionColor;
      const block = (
        <Box
          onClick={()=>handleBlockClick([i, j])}
          key={j.toString()}
          sx={{
            height: '100%',
            width: `${100/size}%`,
            backgroundColor: `rgb(
            ${color.r},
            ${color.g},
            ${color.b})`,
            display: 'inline-block',
            cursor: 'pointer',
          }}
        >
        </Box>
      );
      clomns.push(block);
    }
    rows.push(
        <Box
          key={i.toString()}
          sx={{height: `${100/size}%`}}
        >
          {clomns}
        </Box>,
    );
  }
  return (
    <Box
      ref={gameFrameRef}
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Box ref={squareRef}>
        {rows}
      </Box>
    </Box>
  );
};

ColorFinder.propTypes = {
  startLevel: PropTypes.number.isRequired,
  onLevelUpdate: PropTypes.func,
};

const Result = (props) => {
  const [buttonEnabled, setButtonEnabled] = useState(false);
  const {reachedLevel,
    onGameRestartButtonClick, onBackToMenuButtonClick} = props;
  useEffect(() => {
    setTimeout(() => {
      setButtonEnabled(true);
    }, 1500);
  });
  const handleGameRestartButtonClick = () => {
    onGameRestartButtonClick();
  };
  const handleBackToMenuButtonClick = () => {
    onBackToMenuButtonClick();
  };
  return (
    <Fragment>
      <Typography variant='h2' align='center'>
        WOW!
      </Typography>
      <Typography
        variant='h5'
        align='center'
        sx={{
          marginBlock: '0.5rem',
        }}
      >
        You reached level: {reachedLevel}
      </Typography>
      <Button
        variant='contained'
        color='primary'
        disabled={!buttonEnabled}
        onClick={handleGameRestartButtonClick}
      >
        Game Restart
      </Button>
      <Divider/>
      <Button
        variant='contained'
        color='secondary'
        disabled={!buttonEnabled}
        onClick={handleBackToMenuButtonClick}
      >
        Back To Menu
      </Button>
    </Fragment>
  );
};

Result.propTypes = {
  reachedLevel: PropTypes.number.isRequired,
  onGameRestartButtonClick: PropTypes.func,
  onBackToMenuButtonClick: PropTypes.func,
};
