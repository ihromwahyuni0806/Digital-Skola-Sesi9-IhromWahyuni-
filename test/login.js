const { Builder, By, until } = require("selenium-webdriver");
const assert = require("assert");
const chrome = require("selenium-webdriver/chrome")


    let driver = null;

describe("SESI:9 [Login][AddUser][Update][Delete]", async function () {

    before(async ()  => {
        console.log("Starting the test suite for Belajar Bareng");

        if (!driver) {

            const options = new chrome.Options();

            options.addArguments(
                "--headless=new",
                "--window-size=1920,1080"
            );

            driver = await new Builder()
                .forBrowser("chrome")
                .setChromeOptions(options)
                .build();
        }
    
        await driver.get("https://belajar-bareng.onrender.com/");

    });

    beforeEach(async function () {
        console.log("\n===== START TEST =====");
    });

     afterEach(async function () {

        if (this.currentTest) {
            if (this.currentTest.state === "passed") {
                console.log(
                    `===== PASS: ${this.currentTest.title} =====`
                );
            } else {
                console.log(
                    `===== FAIL: ${this.currentTest.title} =====`
                );
            }
        }
    });

    after(async () => {

        console.log("\n===== AFTER: Close Browser =====");

        if (driver) {
            await driver.quit();
            driver = null;
        }
    });


    //=======TEST 1 LOGIN========
    it("[Regression][Login] Should Success Login", async function () {
        
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

        const title = await driver.getTitle();

        assert.strictEqual(title, "User Management");
        await lockButton.isDisplayed();

    });

    it("[Smoke][addUser] Should Success Add New User", async function () {



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
        // Delay 1 seconds
        await new Promise(resolve => setTimeout(resolve, 1000));

        await ageInput.sendKeys("24");
        // Delay 1 seconds
        await new Promise(resolve => setTimeout(resolve, 1000));

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

        // Delay 5 seconds sebelum klik Update
        await new Promise(resolve => setTimeout(resolve, 5000));

    });

    it("[Smoke][deleteUser] Should Success Delete Data User", async function () {
        
        //click Update button to endpoint /delete
        let deleteButton = await driver.findElement(
                By.xpath('//button[@data-testid="delete-button"]')
        );
        await deleteButton.click();


        //Select User Data to Delete
        let searchUserInput = await driver.findElement(
            By.xpath('//input[@class="custom-select-display search-input"]')
        );
        await searchUserInput.sendKeys("Yunix");

        //Delay 3 seconds sebelum klik Update
        await new Promise(resolve => setTimeout(resolve, 3000));

        const userOption = await driver.wait(
            until.elementLocated(
                By.xpath('(//div[@class="option" and normalize-space()="Yunix"])')
            ),2000
        );
        await userOption.click();

        //submit delete
        let submitButton = await driver.findElement(
            By.xpath('//button[@data-testid="delete-button"]')
        );
        await submitButton.click();

        // Handle confirmation popup
        const alert = await driver.switchTo().alert();

        assert.strictEqual(
            await alert.getText(),
            "Are you sure you want to delete this user?"
        );

        // Click OK
        await alert.accept();

        // Delay 5 seconds sebelum klik Update
        await new Promise(resolve => setTimeout(resolve, 5000));

        //find for assert
        // Wait for success toast
        const successMessage = await driver.wait(
            until.elementLocated(
                By.css('[data-testid="toast-content"]')
            ),
            5000
        );

        const actualMessage = (
                await successMessage.getAttribute("textContent")
        ).replace(/\s+/g, " ").trim();

        console.log("Toast message:", actualMessage);

        assert.strictEqual(
            actualMessage,
            'User deleted successfully!',
            `Expected deleted success message, but got: "${actualMessage}"`
        );

    });


    it("[Smoke] [updateUser] Should Success Update Username Data User", async function () {
        
        //click Update button to endpoint /update
        let updateButton = await driver.findElement(
                By.xpath('//button[@data-testid="update-button"]')
        );
        await updateButton.click();


        //Select User Data to Update
        let searchUserInput = await driver.findElement(
            By.xpath('//input[@class="custom-select-display search-input"]')
        );
        await searchUserInput.sendKeys("Yuni");

        //Delay 3 seconds sebelum klik Update
        await new Promise(resolve => setTimeout(resolve, 3000));

        const userOption = await driver.wait(
            until.elementLocated(
                By.xpath('(//div[@class="option" and normalize-space()="Yuni"])[1]')
            ),2000
        );
        await userOption.click();

        //Update Username & Age
        let usernameUpdate = await driver.findElement(
            By.xpath('//input[@data-testid="username-input"]')
        );

        let ageUpdate = await driver.findElement(
            By.xpath('//input[@data-testid="age-input"]')
        );

        let submitButton = await driver.findElement(
            By.xpath('//button[@data-testid="submit-button"]')
        );

        //action
        await usernameUpdate.clear();
        await usernameUpdate.sendKeys("Yunix");

        // Delay 2 seconds
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        await ageUpdate.clear();
        await ageUpdate.sendKeys("25");

        // Delay 1 seconds
        await new Promise(resolve => setTimeout(resolve, 1000));
        await submitButton.click();

        //find for assert
        // Wait for success toast
        const successMessage = await driver.wait(
            until.elementLocated(
                By.css('[data-testid="toast-content"]')
            ),
            5000
        );

        const actualMessage = (
                await successMessage.getAttribute("textContent")
        ).replace(/\s+/g, " ").trim();

        console.log("Toast message:", actualMessage);

        assert.strictEqual(
            actualMessage,
            'User "Yunix" updated successfully!',
            `Expected update success message, but got: "${actualMessage}"`
        );

    });

});