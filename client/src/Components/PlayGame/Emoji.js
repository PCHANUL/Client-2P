import React from 'react'
import { withRouter } from 'react-router-dom'

import {
  Tooltip,
  Fab,
  GridList,
  GridListTile,
} from '@material-ui/core'

const style = {
  pos: {
    position: 'fixed',
    bottom: '3%',
    right: '3%',
  }
}


function Emoji({ openEmojiList }) {
  return (
    <Tooltip
      title='이모티콘'
      aria-label='add'
      onClick={openEmojiList}
    >
      <Fab color='secondary' style={style.pos}>
        <EmojiEmotionsIcon />
      </Fab>
    </Tooltip>

    <div className={classes.rootroot}>
      {this.state.showEmojis ? (
        <GridList cellHeight={180} className={classes.gridList}>
          {this.tileData.map((tile) => (
            <GridListTile
              key={tile.img}
              style={{ height: '100px' }}
              onClick={() => {
                if (this.state.isActive === false) {
                  this.activeEmoji(tile.img);
                  this.setState({
                    showEmojis: !this.state.showEmojis,
                    isActive: !this.state.isActive,
                  });
                }
              }}
            >
              <img src={tile.img} alt={tile.title} style={{ width: '70px', height: '70px' }} />
            </GridListTile>
          ))}
        </GridList>
      ) : null}
    </div>
  )
}

export default withRouter(Emoji)