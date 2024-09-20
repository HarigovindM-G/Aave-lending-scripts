const { ethers, getNamedAccounts } = require("hardhat");
const { getWeth, AMOUNT } = require("./getWeth.js");
const abi = require("../ContractAbis/poolprovider.json");
const poolAbi = require("../ContractAbis/pool.json");

const poolProviderAddress = "0x2f39d218133AFaB8F2B819B1066c7E434Ad94E9e";
async function main() {
    await getWeth();
    const { deployer } = await getNamedAccounts();
    const poolProvider = await ethers.getContractAt(
        abi,
        poolProviderAddress,
        deployer
    );
    const poolAddress = await poolProvider.getPool();
    // console.log(poolAddress);

    const pool = await ethers.getContractAt(poolAbi, poolAddress, deployer);
    const wethTokenAddress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";

    // now we want a way for lending pool to get access to our weth token
    await approveERC20(wethTokenAddress, poolAddress, AMOUNT, deployer);

    //next thing to do is deposit/supply the pool with token
    const supplytx = await pool.supply(wethTokenAddress, AMOUNT, deployer, 0);
    await supplytx.wait(1);
    console.log("Weth supplied to the pool ");
    let { totalDebtBase, availableBorrowsBase } = await getBorrowData(
        pool,
        deployer
    );

    const daiAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F";

    // const borrowAmount = ethers.utils.parseUnits("970", 18);
    const price = await getDaiPrice();

    const amountDaiToBorrow =
        availableBorrowsBase.toString() * 0.95 * (1 / price.toNumber());


    const amountDaiToBorrowWei = ethers.utils.parseEther(
         amountDaiToBorrow.toString()
     );


    await borrowDai(daiAddress, pool, amountDaiToBorrowWei, deployer);

    await getBorrowData(pool, deployer);

    await repay(daiAddress,poolAddress,pool,deployer,amountDaiToBorrowWei)

    await getBorrowData(pool, deployer);
}

async function getBorrowData(pool, account) {
    // everything is in WEI eth
    const { totalCollateralBase, totalDebtBase, availableBorrowsBase } =
        await pool.getUserAccountData(account);
    console.log(`Current collateral is : ${totalCollateralBase} Wei`);
    console.log(`Current debt is :  ${totalDebtBase} Wei`);
    console.log(`You can borrow : ${availableBorrowsBase} Wei`);
    return { totalDebtBase, availableBorrowsBase };
}

async function getDaiPrice() {
    const daiEthPriceFeed = await ethers.getContractAt(
        "AggregatorV3Interface",
        "0x773616E4d11A78F511299002da57A0a94577F1f4"
    );
    const price = (await daiEthPriceFeed.latestRoundData())[1];
    console.log(`The DAI/ETH price is ${price.toString()}`);
    return price;
}

async function approveERC20(ercAddress, spenderAddress, amount, account) {
    const erc20 = await ethers.getContractAt("IERC20", ercAddress, account);
    // now we have to approve the pool to access our token
    const tx = await erc20.approve(spenderAddress, amount);
    console.log(`${spenderAddress} is approved to spend ${amount}`);
}

async function borrowDai(daiAddress, pool, amount, account) {
    const tx = await pool.borrow(daiAddress, amount, 2, 0, account);
    console.log(`You have succefully borrowed ${amount} DAI`);
}

async function repay( daiAddress,poolAddress ,pool , account, amount ) {
    await approveERC20(daiAddress, poolAddress, amount, account);
    const repayTx = await pool.repay(daiAddress, amount, 2, account);
    await repayTx.wait(1);
    console.log("Repaid!");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error);
        process.exit(1);
    });
