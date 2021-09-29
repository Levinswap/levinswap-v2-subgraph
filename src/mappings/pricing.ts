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
  '0xb8403b7730368942a5bfe5aac04a31b44015b1cc', // RealT 11078-Wayburn
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
  '0x4a99cc509f7facf58d7b67e99236db5e0921ef81', // RealT 10639
  '0x5600e25b4f24c63afa655c3bd96e3c178b654fa1', // RealT 13045
  '0x2adc1cfa726a45264a328d9d2e2c692ceac97458', // RealT 14494
  '0xad91999f534f4075b00ba4231c018e57bdebb342', // RealT 18983
  '0x211618fa0934910666f2c2731101f5a3ac013fd8', // RealT 19200
  '0x4cc53ee5ef306a95d407321d4b4acc30814c04ee', // RealT 19163
  '0xd9e89bfebae447b42c1fa85c590716ec8820f737', // RealT 4061
  '0xefe82d6baf0db71f92889eb9d00721bd49121316', // RealT 4680
  '0x8a9f904b4ead6a97f3ab304d0d2196f5c602c807', // RealT 19311
  '0x7e95b310724334ff74537dc08bfd3377d25e65ce', // RealT 15039
  '0x75f06b482adbfb04b877d8ee683e2fcdf18ad153', // RealT 18481
  '0x31820af2d43c08bd82bd94b08974062482bd98d3', // RealT 11653
  '0x8d1090df790ffafdaccda03015c05df3b4cc9c21', // RealT 15753
  '0x1fdb4015fd5e031c5641752c1e03b973ad5ea168', // RealT 17500
  '0xa29ae272bc89e5f315b2793925f700045f845d82', // RealT 587
  '0x08ad1f3a48be1d23c723a6cc8486b247f5de935a', // Realt 13116
  '0x34ed9e71449529e034d0326cfbb3b5ccdca00cbc', // RealT 19314
  '0xfe17c3c0b6f38cf3bd8ba872bee7a18ab16b43fb', // RealT 1577
  '0x41599149f1b52035392402f9e311b1edb0c9f699', // RealT 14319
  '0x315699f1ba88383cff2f2f30fcad187adb2e4d72', // RealT 14078
  '0x6f442da588232dc57bf0096e8de48d6961d5cc83', // RealT 13896
  '0x96700ffae33c651bc329c3f3fbfe56e1f291f117', // RealT 4380
  '0x499a6c19f5537dd6005e2b5c6e1263103f558ba4', // RealT 17813
  '0xb3d3c1bbcef737204aadb4fa6d90e974bc262197', // RealT 15796
  '0x73bde888664df8ddfd156b52e6999eeabab57c94', // RealT 9717
  '0x830b0e9a5ecf36d0a886d21e1c20043cd2d16515', // RealT 19201
  '0x3c56d5e887d8fa7ae1ba65bf7eccc25ec09eaf18', // RealT 9165
  '0x67a83b28f6dd8c07301495ee2c6f83b73fd21092', // RealT 9309
  '0xa69d7d4ddf397f3d1e7ebaf108555d1107b3b117', // RealT 9166
  '0xd1c15cebfdcd16f00d91666bf64c8b66cbf5e9b5', // RealT 10612
  '0xe5ce63ac9a08c1eb160889151cd84855f16c94d2', // Realt 10616
  '0x806690b7a093d2cf6419a515abedb7f28595bc5e', // RealT 9169
  '0x400b5716b0c23b6f1f0f2a5fdb038949962b803e', // RealT 3432
  '0xee2f2212a64ec3f6bc0f7580e10c53cb38b57508', // RealT 12334
  '0x537dc65657ed455d1c17e319fe6f4926d6033f2b', // RealT 10974
  '0x46f8a600337dec5cab03aa9b8f67f1d5b788ce28', // RealT 18433
  '0x4e98493920b16dd6642e9d48497c8d0a49150f6f', // RealT 13991
  '0xd08d2b199e9e5df407427d4085877d1fdff3b1d6', // RealT 6923
  '0x1eb16ec378f0ce8f81449120629f52ba28961d47', // RealT 1000
  '0xa68b7779504b0ae372ddcc109f8786db9b91e93e', // RealT 4340
  '0x8626b38267e4fc0d8c92e0bb86f97acab3f6aa05', // RealT 10604
  '0xe82cbb7c29d00a4296ee505d12a473c26cd9c423', // RealT 10700
  '0x57eadd2a542cfe9f00a37f55df4d5062f857c0e8', // RealT 9943
  '0x021bb23a45e9fc824260435e670fc383b7b8cbbb', // RealT 16200
  '0x23684569c0636c9aea246551879d457d0a0e6f58', // RealT 9336
  '0x6db6d540f5614e6bab7475af3f430f46a0b083e2', // RealT 5942
  '0xeedc2f5f4d1226759b1acf9efa23a99661de6663', // RealT 20200
  '0xb5d30c28f87acf675ed5b9f343e5fff39ec9942c', // RealT 10024
  '0x741857c07b100c9c0c1272d95845dddc4f1b67cb', // RealT 8342
  '0xf18cffb528eca0ea31d1d6b28bc80d2eca34d14d', // RealT 25097
  '0x21f1af3e751317a2f7de7df31d5d092e6a907bde', // RealT 18276
  '0xa81f77e8988b28fb74243b907ace3c83353dc80a', // RealT 15634
  '0x9eb90ec3faafc22092c9b91559fddde538042093', // RealT 18900
  '0xe3902e329ef2d3fd7666022c139d75bcc984b7a5', // RealT 15048
  '0xce111a198eb04f388aceb78c40ced6daf1b0514a', // RealT 272
  '0x92161385c9de8798ad5fb01c0be99ffcbc84dfd8', // RealT 10084
  '0xd5fc0c4c4c5ff316e1e91494d963ff1d52ba25ff', // RealT 11078-Longview
  '0x311fc485f1fea0c8cc9b5c783e79f4313ddfa720', // RealT 19996
  '0x804f6baa10615c85e4b4a5bc4efe516d9f7a4365', // RealT 13606
  '0x969d42ad7008e6651e1fd52742153f8743225d98', // RealT 12409
  '0x9d918ee39a356be8ef99734599c7e70160db4db6', // RealT 12405 (weth)
  '0x8fcb39a25e639c8fbd28e8a018227d6570e02352', // RealT 1815 (weth)
  '0xdd833d0eef6d5d7cec781b03c19f3b425f3039df', // RealT 11957 (weth)
  '0xf4657ab08681214bcb1893aa8e9c7613459250ec', // RealT 1617 (weth)
  '0xe887dc4fcb5240c0c080aeab8870421d3ebd0b28', // RealT 14066 (weth)
  '0x5b690b010944bdfa8b26116967fe3fb3c38cfaac', // RealT 13370 (weth)
  '0x78a9013b53d2d255935bbc43112d0dd3f475f3d3', // RealT 15203 (weth)
  '0x0954682ff1b512d3927d06c591942f50917e16a0', // RealT 10021 (weth)
  '0xcb061ae1f9b618c44ac10a47a672bf438da01fd8', // RealT 893-895 (weth)
  '0x38de2858be53d603b1104f16aa67cf180002465d', // RealT 738-742 (weth)
  '0xf5aeab9d9c707b56311066e5172239686ab88110', // RealT 2318-2324 (weth)
  '0x9b091105b9a9eb118f4e0da06a090d6d95463357', // RealT 11217 (weth)
  '0x4471962eeffec57a33fa4e0793efeec07684dffb', // RealT 10003 (weth)
  '0xca4e38439d5d86554431e15eced03b8bcf2abddd', // RealT 15864 (weth)
  '0x6bd094e39d0b839689e2f900bfdd180b10df62d7', // RealT 12410 (weth)
  '0x81cea1a7c83d5caed483dd4da59bfe98f24ef687', // RealT 15379 (weth)
  '0x328249efca026ae8596e9afe913c5f8775ef60ae', // RealT 14884 (weth)
  '0x10c2c7a5342988818eb6726fae369299d8fb6328', // RealT 14839 (weth)
  '0xd3f7130940c7746298d9778f79e7bba4c552f176', // RealT 11758 (weth)
  '0x8c3761c5d489ee5a5c30f874b5220c769a7c5a16', // RealT 15841 (weth)
  '0x0c12f2b2c3ad5150d344b6d3abb901b4795d72d9', // RealT 14215 (weth)
  '0x46b00b4bf04c2c94ae67576004a3a247b9400ade', // RealT 116 (weth)
  '0xe7b6de709ffc3bd237c2f2c800e1002f97a760f3', // RealT 4852-4854 (usdc)
  '0xef2b6234e376c3b152c5febe47e1ca3c73cdaa9f', // RealT 15208 (weth)
  '0xa5c16ae5fd75f4f079f3e33f0124899bacf567f9', // RealT 882-884 (weth)
  '0xa8ab830bfd0d91bc017cdec98a2a198b9938ea8d', // RealT 12747-12749 (weth)
  '0x94c1bfa7826c4ef28969a0eb49e82a614a723f8c', // RealT 2550 (weth)
  '0x24a2558d0b0b2247a64eab7cf09d7244cb4c9597', // RealT 17616 (weth)
  '0x690602eb0bf5607e3586f1d3e4c4601ef6e4a89f', // RealT 8531 (weth)
  '0x185e39d860cf86fbecf4a7c341bd1545ea3a41b9', // RealT 20552 (weth)
  '0xcd7dc5e034b631331bc0cfc4ea71d2dc7b53c338', // RealT 2950-2952 (weth)
  '0x2360fca74ed948ff4f962e369080a64a40a1300d', // RealT 8366 (weth)
  '0xc7785a2575606d444cefbc8a22591600ae5aa9b4', // RealT 13041 (weth)
  '0x5162d60b699a44b9f09b5fbfd8e6343cde9d7b22', // RealT 128 (weth)
  '0x2b683f8cc61de593f089bdddc01431c0d7ca2ee2', // RealT 601 (weth)
  '0xde9122799c313d5cc5c4385984156ad068cde331', // RealT 1612 (weth)
  '0x83b16b1dcaaeb59caa13b96da260d8b15671822a', // RealT 1204 (weth)
  '0x4505f5bff6bada5a20b1a008c6db3cd9545027a4', // RealT 338 (weth)

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