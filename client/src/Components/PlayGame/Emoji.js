import React from 'react'
import { withRouter } from 'react-router-dom'

import {
  Tooltip,
  Fab,
  GridList,
  GridListTile,
} from '@material-ui/core'
import EmojiEmotionsIcon from '@material-ui/icons/EmojiEmotions';

const style = {
  buttonPos: {
    position: 'fixed',
    bottom: '3%',
    right: '3%',
  },
  listPos: {
    position: 'fixed',
    right: '1%',
    bottom: '100px',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  listCard: {
    width: '200px', 
    height: '40vw',
  },
  tile: {
    width: '100px', 
    height: '90px',
  },
  img: {
    width: '70px', 
    height: '70px',
  }
}


function Emoji({ openEmojiList, activeEmoji, showEmojis, tileData }) {
  return (
    <>
      <Tooltip title='이모티콘' aria-label='add' onClick={openEmojiList}>
        <Fab color='secondary' style={style.buttonPos}>
          <EmojiEmotionsIcon />
        </Fab>
      </Tooltip>

      <div style={style.listPos}>
        {showEmojis && 
          <GridList style={style.listCard}>
            {tileData.map((tile) => (
              <GridListTile
                key={tile.img}
                style={style.tile}
                onClick={() => activeEmoji(tile.img)}
              >
                <img src={tile.img} alt={tile.title} style={style.img} />
              </GridListTile>
            ))}
          </GridList>
        }
      </div>
    </>
  )
}

export default withRouter(Emoji)