const { ethers, getNamedAccounts} = require("hardhat")

const AMOUNT = ethers.utils.parseEther("10")

async function getWeth(){
    const {deployer} = await getNamedAccounts();
    const iweth = await ethers.getContractAt(
        "IWeth",
        "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
        deployer,
    )
    const tx = await iweth .deposit({value:AMOUNT})
    await tx.wait(1)
    const wethBal = await iweth.balanceOf(deployer)
    console.log(`The deployers weth balance is : ${ethers.utils.formatEther(wethBal)}`)
    

}   
module.exports = { getWeth , AMOUNT}