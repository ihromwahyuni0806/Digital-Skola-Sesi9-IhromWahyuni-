const { Builder, By, until } = require("selenium-webdriver");
const assert = require("assert");

    let driver = null;

    async function getDriver() {
    if (!driver) {
        driver = await new Builder()
            .forBrowser("chrome")
            .build();

        await driver.manage().window().maximize();
    }

    return driver;
    }

describe("SESI:9 [Login][AddUser]", async function () {


    it("Should Success Login", async function () {
        const driver = await getDriver();
        await driver.get("https://belajar-bareng.onrender.com/");

        //find element
        let usernameInput = await driver.findElement(
            By.xpath('//input[@data-testid="username-input"]')
        );

        let passwordInput = await driver.findElement(
            By.xpath('//input[@data-testid="password-input"]')
        );

        let loginButton = await driver.findElement(
            By.xpath('//button[@data-testid="login-button"]')
        );

        //action
        await usernameInput.sendKeys("admin");
        await passwordInput.sendKeys("admin");
        await loginButton.click();

        //find for Assertion
        let lockButton = await driver.findElement({id : "logout-btn"});

        let title = await driver.getTitle();

        assert.strictEqual(title, "User Management");
        await lockButton.isDisplayed();

    });

    it("Should Success Add New User", async function () {

        //add button, delay to get render id add-button
        let addButton = await driver.wait(
            until.elementLocated(
                By.xpath('//button[@data-testid="add-button"]')
            ), 5000
        );

        //click add button to endpoint /add
        await addButton.click();

        //find element page add users
        let userInput = await driver.findElement(
            By.xpath('//input[@data-testid="username-input"]')
        );

        let ageInput = await driver.findElement(
            By.xpath('//input[@data-testid="age-input"]')
        );

        let submitButton = await driver.findElement(
            By.xpath('//button[@data-testid="submit-button"]')
        );
        

        //action        
        await userInput.sendKeys("Yuni");
        await ageInput.sendKeys("24");
        await submitButton.click();


        //find for assert
        // Wait for success toast
        const successMessage = await driver.wait(
            until.elementLocated(
                By.css('[data-testid="toast-content"]')
            ),
            5000
        );

        const actualMessage = await successMessage.getAttribute("textContent");

        console.log("Toast message:", actualMessage);

        assert.ok(
            actualMessage.includes("User successfully added"),
            `Expected success message, but got: "${actualMessage}"`
        );
        
        
        await driver.quit();

    });

});