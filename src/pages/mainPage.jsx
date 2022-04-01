import React, {Fragment, useEffect, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import {Box} from '@mui/system';
import {Button, Divider, Stack, Typography} from '@mui/material';

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
          flexGrow: '1',
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
  const [gameDetailData, setGameDetailData] = useState(null);
  let content;
  switch (gameState) {
    case GameState.menu:
      content = (
        <Menu
          onStartButtonClick={()=>{
            setGameState(GameState.playing);
            setCurrentLevel(1);
            setGameDetailData({
              finalLevel: 1,
              levelRecordList: [],
            });
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
            onLevelUpdate={(newLevelInfo) => {
              setCurrentLevel(newLevelInfo.level);
              const newData = {
                finalLevel: newLevelInfo.level,
                levelRecordList: [...gameDetailData.levelRecordList, {
                  level: newLevelInfo.level,
                  questionColor: newLevelInfo.questionColor,
                  answerColor: newLevelInfo.answerColor,
                  incorrectCount: 0,
                }],
              };
              setGameDetailData(newData);
            }}
            onLevelComplete={(levelRecordData) => {
              const newData = {
                ...gameDetailData,
              };
              newData.levelRecordList[
                  newData.levelRecordList.length-1].spendTime =
                  levelRecordData.spendTime;
              setGameDetailData(newData);
            }}
            onIncorrectColorClick={() => {
              const newData = {
                ...gameDetailData,
              };
              newData.levelRecordList[
                  newData.levelRecordList.length-1].incorrectCount++;
              setGameDetailData(newData);
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
          detailData={gameDetailData}
          reachedLevel={currentLevel}
          onGameRestartButtonClick={() => {
            setGameState(GameState.playing);
            setCurrentLevel(1);
            setGameDetailData({
              finalLevel: 1,
              levelRecordList: [],
            });
          }}
          onBackToMenuButtonClick={() => {
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

  useEffect(() => {
    setTimeout(() => {
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
  const {startLevel, onLevelUpdate,
    onLevelComplete, onIncorrectColorClick} = props;

  const [level, setLevel] = useState(startLevel);

  const generateLevelInfo = (level) => {
    const getSize = () => {
      return Math.floor((level - 1) / 10) + 2;
    };
    const getRandomPosition = (size) => {
      return [
        Math.floor(Math.random() * size),
        Math.floor(Math.random() * size),
      ];
    };
    const getRandomColor = () => {
      return {
        r: Math.random() * 255,
        g: Math.random() * 255,
        b: Math.random() * 255,
      };
    };
    const generateAnswerColor = (questionColor) => {
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
    const size = getSize();
    const questionColor = getRandomColor();
    return {
      size: size,
      questionColor: questionColor,
      answerColor: generateAnswerColor(questionColor),
      answerPosition: getRandomPosition(size),
    };
  };
  const [levelInfo, setLevelInfo] = useState(generateLevelInfo(startLevel));

  const gameFrameRef = useRef(null);
  const squareRef = useRef(null);

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    onLevelUpdate({
      level: level,
      questionColor: levelInfo.questionColor,
      answerColor: levelInfo.answerColor,
    });
    setTime(new Date());
  }, [level]);

  const handleResize = () => {
    const size = Math.min(
        gameFrameRef.current.offsetWidth,
        gameFrameRef.current.offsetHeight );
    squareRef.current.style.width = size + 'px';
    squareRef.current.style.height = size + 'px';
  };

  const [time, setTime] = useState(new Date());

  const handleBlockClick = (position) => {
    if (position[0] === levelInfo.answerPosition[0] &&
        position[1] === levelInfo.answerPosition[1]) {
      const currentTime = new Date();
      onLevelComplete({
        spendTime: (currentTime - time) / 1000,
      });
      const nextLevel = level + 1;
      setLevel(nextLevel);
      setLevelInfo(generateLevelInfo(nextLevel));
    } else {
      onIncorrectColorClick();
    }
  };

  const rows = [];

  for (let i = 0; i < levelInfo.size; i++) {
    const clomns = [];
    for (let j = 0; j < levelInfo.size; j++) {
      const color =
      (i === levelInfo.answerPosition[0] && j === levelInfo.answerPosition[1])?
      levelInfo.answerColor: levelInfo.questionColor;
      const block = (
        <Box
          onClick={() => handleBlockClick([i, j])}
          key={j.toString()}
          sx={{
            height: '100%',
            width: `${100 / levelInfo.size}%`,
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
          sx={{height: `${100 / levelInfo.size}%`}}
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
  onLevelComplete: PropTypes.func,
  onIncorrectColorClick: PropTypes.func,
};

const Result = (props) => {
  const [buttonEnabled, setButtonEnabled] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const {reachedLevel, detailData,
    onGameRestartButtonClick, onBackToMenuButtonClick} = props;
  useEffect(() => {
    setTimeout(() => {
      setButtonEnabled(true);
    }, 1500);
  });
  const handleShowGameDetailButtonClick = () => {
    setShowDetail(true);
  };
  const handleGameRestartButtonClick = () => {
    onGameRestartButtonClick();
  };
  const handleBackToMenuButtonClick = () => {
    onBackToMenuButtonClick();
  };
  const gameDetails = detailData.levelRecordList.map((levelRecord, index)=>{
    return (
      <Fragment key={index}>
        <Box key={index}>
          <Typography variant='h4' align='center'>
            Level {levelRecord.level}
          </Typography>
          <Stack
            direction='row'
            justifyContent='space-between'
            alignItems='center'
          >
            <Box>
              <Box
                sx={{
                  display: 'inline-block',
                }}
              >
                <Box>
                  <Typography>
                    Q
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: 'inline-block',
                    height: '10rem',
                    width: '10rem',
                    backgroundColor: `rgb(
                    ${levelRecord.questionColor.r},
                    ${levelRecord.questionColor.g},
                    ${levelRecord.questionColor.b})`,
                  }}
                >
                </Box>
              </Box>
              <Box
                sx={{
                  display: 'inline-block',
                }}
              >
                <Typography>
                  A
                </Typography>
                <Box
                  sx={{
                    display: 'inline-block',
                    height: '10rem',
                    width: '10rem',
                    backgroundColor: `rgb(
                    ${levelRecord.answerColor.r},
                    ${levelRecord.answerColor.g},
                    ${levelRecord.answerColor.b})`,
                  }}
                >
                </Box>
              </Box>
            </Box>
            <Stack justifyContent='space-around'>
              <Typography>
                {levelRecord.spendTime?
                  `spend time: ${levelRecord.spendTime} sec`:
                  'Not completed yet'}
              </Typography>
              <Divider/>
              <Typography>
                Incorrect times: {levelRecord.incorrectCount}
              </Typography>
            </Stack>
          </Stack>
        </Box>
        <Divider/>
      </Fragment>
    );
  });
  return (
    <Fragment>
      <Box
        sx={{
          display: showDetail? 'none': 'block',
        }}
      >
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
      </Box>
      <Stack
        sx={{
          display: showDetail? 'flex': 'none',
          padding: '10px',
          backgroundColor: 'rgba(0,0,0,0.3)',
          flexGrow: 1,
          flexBasis: 0,
          overflowY: 'auto',
        }}
      >
        {gameDetails}
      </Stack>
      <Button
        variant='contained'
        color='info'
        disabled={!buttonEnabled}
        onClick={handleShowGameDetailButtonClick}
        sx={{
          display: showDetail? 'none': 'flex',
        }}
      >
        Show Game Detail
      </Button>
      <Divider/>
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
  detailData: PropTypes.object.isRequired,
};
