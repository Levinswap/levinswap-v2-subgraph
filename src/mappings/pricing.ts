/* eslint-disable prefer-const */
import { Pair, Token, Bundle } from '../types/schema'
import { BigDecimal, Address, BigInt } from '@graphprotocol/graph-ts/index'
import { ZERO_BD, factoryContract, ADDRESS_ZERO, ONE_BD } from './helpers'

const WXDAI_ADDRESS = '0xe91d153e0b41518a2ce8dd3d7944fa863463a97d'

export function getEthPriceInUSD(): BigDecimal {
  return ONE_BD
}

// token where amounts should contribute to tracked volume and liquidity
let WHITELIST: string[] = [
  '0xe91d153e0b41518a2ce8dd3d7944fa863463a97d', // WXDAI
  '0xddafbb505ad214d7b80b1f830fccc89b60fb7a83', // USDC on xDai
  '0x4ecaba5870353805a9f068101a40e0f32ed605c6', // Tether on xDai
  '0x6a023ccd1ff6f2045c3309768ead9e68f978f6e1', // Wrapped Ether on xDai
  '0x1698cD22278ef6E7c0DF45a8dEA72EDbeA9E42aa', // LEVIN
  '0xda47bd33e8f5d17bb81b8752784bfb46c1c44b2a', // REALT 15350
  '0x5e2a09064b2dca8c44aad8a5b69a69bb1854fe72', // RealT 11201
  '0xb8403b7730368942a5bfe5aac04a31b44015b1cc', // RealT 11078
  '0x92d31e19f88597f368825ba16410f263a844527a', // RealT 8181
  '0xa9f30c907321718e655b74463ca665b690b78894', // RealT 15860
  '0xc731eca970979cd2da2a1094a808f49894070d35', // RealT 19218
  '0x06d0e5aee443093ac5635b709c8a01342e59df19', // RealT 10617
  '0x730fbb27b650a2a3bcaa6729e635dc255acee343', // RealT 1115
  '0x43fed9f9bf7deedcb314b432a8e38219dd62ce9e', // RealT 14825
  '0xba07997f594a52df179620284b52b50a4e66227d', // RealT 18776
  '0xa137d82197ea4cdfd5f008a91ba816b8324f59e1', // RealT 5601
  '0xb09850e2b93aa3aaa1476bf0c007cfc960e2de79', // RealT 14229
  '0x31aa5fa895fd186fde12347a6fcaf540875b6434', // RealT 17809
  '0x4d0da4e75d40bd7d9c4f7a292bf883bcdf38c45d', // RealT 15373
  '0x3150f0ebc0efee280b5348b9c8c271ad44eb8b13', // RealT 19596
  '0xff1b4d71ae12538d86777a954b136cf723fccefd', // RealT 14882
  '0x24293ab20159cfc0f3d7c8727cd827fba63d4f64', // RealT 19333
  '0x9528a7402c0fe85b817aa6e106eafa03a02924c4', // RealT 14231
  '0xb7d311e2eb55f2f68a9440da38e7989210b9a05e' // STAKE on xDai
]

// minimum liquidity required to count towards tracked volume for pairs with small # of Lps
let MINIMUM_USD_THRESHOLD_NEW_PAIRS = BigDecimal.fromString('400000')

// minimum liquidity for price to get tracked
let MINIMUM_LIQUIDITY_THRESHOLD_ETH = BigDecimal.fromString('2')

/**
 * Search through graph to find derived Eth per token.
 * @todo update to be derived ETH (add stablecoin estimates)
 **/
export function findEthPerToken(token: Token): BigDecimal {
  if (token.id == WXDAI_ADDRESS) {
    return ONE_BD
  }

  // loop through whitelist and check if paired with any
  for (let i = 0; i < WHITELIST.length; ++i) {
    let pairAddress = factoryContract.getPair(Address.fromString(token.id), Address.fromString(WHITELIST[i]))
    if (pairAddress.toHexString() != ADDRESS_ZERO) {
      let pair = Pair.load(pairAddress.toHexString())
      if (pair.token0 == token.id && pair.reserveETH.gt(MINIMUM_LIQUIDITY_THRESHOLD_ETH)) {
        let token1 = Token.load(pair.token1)
        return pair.token1Price.times(token1.derivedETH as BigDecimal) // return token1 per our token * Eth per token 1
      }
      if (pair.token1 == token.id && pair.reserveETH.gt(MINIMUM_LIQUIDITY_THRESHOLD_ETH)) {
        let token0 = Token.load(pair.token0)
        return pair.token0Price.times(token0.derivedETH as BigDecimal) // return token0 per our token * ETH per token 0
      }
    }
  }
  return ZERO_BD // nothing was found return 0
}

/**
 * Accepts tokens and amounts, return tracked amount based on token whitelist
 * If one token on whitelist, return amount in that token converted to USD.
 * If both are, return average of two amounts
 * If neither is, return 0
 */
export function getTrackedVolumeUSD(
  tokenAmount0: BigDecimal,
  token0: Token,
  tokenAmount1: BigDecimal,
  token1: Token,
  pair: Pair
): BigDecimal {
  let bundle = Bundle.load('1')
  let price0 = token0.derivedETH.times(bundle.ethPrice)
  let price1 = token1.derivedETH.times(bundle.ethPrice)

  // if less than 5 LPs, require high minimum reserve amount amount or return 0
  // if (pair.liquidityProviderCount.lt(BigInt.fromI32(5))) {
  //   let reserve0USD = pair.reserve0.times(price0)
  //   let reserve1USD = pair.reserve1.times(price1)
  //   if (WHITELIST.includes(token0.id) && WHITELIST.includes(token1.id)) {
  //     if (reserve0USD.plus(reserve1USD).lt(MINIMUM_USD_THRESHOLD_NEW_PAIRS)) {
  //       return ZERO_BD
  //     }
  //   }
  //   if (WHITELIST.includes(token0.id) && !WHITELIST.includes(token1.id)) {
  //     if (reserve0USD.times(BigDecimal.fromString('2')).lt(MINIMUM_USD_THRESHOLD_NEW_PAIRS)) {
  //       return ZERO_BD
  //     }
  //   }
  //   if (!WHITELIST.includes(token0.id) && WHITELIST.includes(token1.id)) {
  //     if (reserve1USD.times(BigDecimal.fromString('2')).lt(MINIMUM_USD_THRESHOLD_NEW_PAIRS)) {
  //       return ZERO_BD
  //     }
  //   }
  // }

  // both are whitelist tokens, take average of both amounts
  if (WHITELIST.includes(token0.id) && WHITELIST.includes(token1.id)) {
    return tokenAmount0
      .times(price0)
      .plus(tokenAmount1.times(price1))
      .div(BigDecimal.fromString('2'))
  }

  // take full value of the whitelisted token amount
  if (WHITELIST.includes(token0.id) && !WHITELIST.includes(token1.id)) {
    return tokenAmount0.times(price0)
  }

  // take full value of the whitelisted token amount
  if (!WHITELIST.includes(token0.id) && WHITELIST.includes(token1.id)) {
    return tokenAmount1.times(price1)
  }

  // neither token is on white list, tracked volume is 0
  return ZERO_BD
}

/**
 * Accepts tokens and amounts, return tracked amount based on token whitelist
 * If one token on whitelist, return amount in that token converted to USD * 2.
 * If both are, return sum of two amounts
 * If neither is, return 0
 */
export function getTrackedLiquidityUSD(
  tokenAmount0: BigDecimal,
  token0: Token,
  tokenAmount1: BigDecimal,
  token1: Token
): BigDecimal {
  let bundle = Bundle.load('1')
  let price0 = token0.derivedETH.times(bundle.ethPrice)
  let price1 = token1.derivedETH.times(bundle.ethPrice)

  // both are whitelist tokens, take average of both amounts
  if (WHITELIST.includes(token0.id) && WHITELIST.includes(token1.id)) {
    return tokenAmount0.times(price0).plus(tokenAmount1.times(price1))
  }

  // take double value of the whitelisted token amount
  if (WHITELIST.includes(token0.id) && !WHITELIST.includes(token1.id)) {
    return tokenAmount0.times(price0).times(BigDecimal.fromString('2'))
  }

  // take double value of the whitelisted token amount
  if (!WHITELIST.includes(token0.id) && WHITELIST.includes(token1.id)) {
    return tokenAmount1.times(price1).times(BigDecimal.fromString('2'))
  }

  // neither token is on white list, tracked volume is 0
  return ZERO_BD
}