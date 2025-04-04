const CostAnalysis = require("../models/costAnalysis.js")
const UserSolarPackage = require("../models/userSolarPackage.js")
const { calCostCustomePackage } = require("../service/simulationService.js")

async function createCostAnalysis(userData) {
    try {
        const existingUserPackage = await CostAnalysis.findOne({ packageId: userData.packageId })

        if (existingUserPackage) {
            console.log(`Cost Analysis for ${userData.packageId} already exist`)
            return
        }

        //user must save an existing package before he can save the cost
        const userPackage = await UserSolarPackage.findOne({ user: userData.user, name: userData.packageName })

        if (!userPackage) {
            console.log(`UserPackage ${userPackage.name} does not exist`)
            return
        }

        const result = await calCostCustomePackage(userPackage)
        console.log(result)
        const { totalCost, panelCost, batteryCost, inverterCost, installationCost } = result

        const newCostAnalysis = new CostAnalysis({
            ...userData,
            panelCost,
            batteryCost,
            inverterCost,
            installationCost,
            totalCost,
        })

        await newCostAnalysis.save()
        console.log(`Cost analysis for ${userPackage.name} saved successfully`)
    } catch (error) {
        console.log("Unable to create cost analysis", error.message)
    }
}

module.exports = { createCostAnalysis }