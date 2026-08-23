const { Builder, By, until } = require("selenium-webdriver");
const assert = require("assert");
const chrome = require("selenium-webdriver/chrome")


describe("SESI:10 [addChart]", async function () {

    let driver = null;
    let bookingCode;

    before(async ()  => {
        console.log("Starting the test suite for Belajar Bareng");

         if (!driver) {

            const options = new chrome.Options();

            options.addArguments(
                //"--headless=new",
                "--window-size=1920,1080"
            );

            driver = await new Builder()
                .forBrowser("chrome")
                .setChromeOptions(options)
                .build();
        }

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

    it("[Shop] Should Success Add to Chart", async function () {
    
            //add button, delay to get render id shop-button
            let shopButton = await driver.wait(
                until.elementLocated(    
                    By.xpath('//button[@data-testid="shop-button"]')
                ),3000
            );
    
            //click add button to endpoint /Shop
            await shopButton.click();
    
            //Chart Kucing ngga guna
            let chartInput2 = await driver.findElement(
                By.xpath('//button[@data-testid="add-to-cart-7"]')
            );

            //Chart Tuyul Asli 100%
            let chartInput1 = await driver.findElement(
                By.xpath('//button[@data-testid="add-to-cart-1"]')
            );

    
            //action        
            await chartInput2.click();
            await chartInput2.click();
            await chartInput1.click();
    
            //find for assert
            const cartButton = await driver.wait(
                until.elementLocated(
                    By.xpath('//div[@data-testid="cart-button"]')
                ),
                2000
            );

            const cartText = await cartButton.getText();

            console.log("Cart:", cartText);

            const cartCount = parseInt(cartText.match(/\d+/)[0], 10);

            assert.strictEqual(
                cartCount, 3,
                `Expected cart quantity to be 3, but got ${cartCount}`
            );
        });

        it("[Shop] [Delete] Should Success Delete 1 Product from Chart", async function () {
    
            //add button, delay to get render id add-button
            let ChartList = await driver.findElement(
                    By.xpath('//div[@data-testid="cart-button"]')
            );

            await ChartList.click();
    
            //Delete quantity 1 Kucing ngga guna
            let chartDelete = await driver.findElement(
                By.xpath('//button[@data-testid="decrease-7"]')
            );

    
            //action        
            await chartDelete.click();
    
            //find for assert
            const cartQty = await driver.wait(
                until.elementLocated(
                    By.xpath('//span[@data-testid="cart-qty-7"]')
                ),
                3000
            );

            const actualQty = await cartQty.getText();

            console.log("Cart quantity:", actualQty);

            assert.strictEqual(
                actualQty.trim(),
                "1",
                `Expected cart quantity to be 1, but got "${actualQty}"`
            );
        });

        it("[Shop] [Checkout] Should Success Checkout from Chart", async function () {
    
            //Checkout button
            let checkoutButton = await driver.findElement(
                    By.xpath('//button[@data-testid="checkout-button"]')
            );

            await checkoutButton.click();

            // Delay 2 seconds
            await new Promise(resolve => setTimeout(resolve, 2000));
    
            //Form checkout
            let nameCheckout = await driver.findElement(
                By.xpath('//input[@data-testid="checkout-name"]')
            );

            let emailCheckout = await driver.findElement(
                By.xpath('//input[@data-testid="checkout-email"]')
            );
            
            let addressCheckout = await driver.findElement(
                By.xpath('//textarea[@data-testid="checkout-address"]')
            );

            //===Captcha Question===
            let captchaQuestion = await driver.findElement(
                By.xpath('//span[@data-testid="captcha-question"]')
            );
            let question = await captchaQuestion.getText();

            console.log("CAPTCHA Question:", question);

            // Extract numbers
            let numbers = question.match(/\d+/g);

            let num1 = parseInt(numbers[0], 10);
            let num2 = parseInt(numbers[1], 10);

            // Calculate answer
            let answer = num1 + num2;

            console.log("CAPTCHA Answer:", answer);

            //Captcha Input
            let captchaInput = await driver.findElement(
                By.xpath('//input[@data-testid="checkout-captcha"]')
            );

            //action for input form       
            await nameCheckout.sendKeys("Ihrom Wahyuni");
            await emailCheckout.sendKeys("ihromwahyunix@gmail.com");
            await addressCheckout.sendKeys("Jl Strawberry Mangga");
            await captchaInput.sendKeys(answer.toString());


            //checkbox tnc
            let checkboxTnc = await driver.findElement(
                By.xpath('//input[@data-testid="tnc-checkbox"]')
            );

            await checkboxTnc.click();

            //popup tnc
            let buttonTnc = await driver.wait(
                until.elementLocated(
                    By.xpath('(//button[@data-testid="tnc-ok-button"])')
                ),3000
            );

            await buttonTnc.click();

            //submit checkout
            let buttonSubmit = await driver.wait(
                until.elementLocated(
                    By.xpath('(//button[@data-testid="submit-checkout"])')
                ),3000
            );

            await buttonSubmit.click();

            // Delay 5 seconds
            await new Promise(resolve => setTimeout(resolve, 5000));

    
            //====find for assert=====
            // Assert success title
            const successTitle = await driver.wait(
                until.elementLocated(
                    By.xpath('//h2[@data-testid="success-title"]')
                ),
                5000
            );

            assert.strictEqual(
                (await successTitle.getText()).trim(),
                "🎉 Checkout Successful!"
            );

            // Assert booking code exists
            const bookingCodeInput = await driver.findElement(
                By.xpath('//strong[@data-testid="booking-code"]')
            );

            const actualBookingCode = await bookingCodeInput.getText();

            assert.ok(
                actualBookingCode.trim().length > 0,
                "Booking code should not be empty"
            );

            console.log("Booking Code:", actualBookingCode);
            bookingCode = actualBookingCode;

            // Assert checkout total
            const checkoutTotal = await driver.findElement(
                By.xpath('//h3[@data-testid="checkout-total"]')
            );

            const actualTotal = await checkoutTotal.getText();

            console.log("Checkout Total:", actualTotal);

            assert.ok(
                actualTotal.includes("10.999.999"),
                `Expected total Rp 10.999.999, but got "${actualTotal}"`
            );

            //close popup
            let closePopup = await driver.wait(
                until.elementLocated(
                    By.xpath('(//button[@data-testid="checkout-success-ok-button"])')
                ),3000
            );

            await closePopup.click();

        });

    it("[Shop] [Checkout] Should Success Track Order", async function () {

            //Checkout button
            let trackButton = await driver.wait(
                 until.elementLocated(
                    By.xpath('//div[@data-testid="track-booking-button"]')
                 ), 3000
            );

            await trackButton.click();

            //Form Booking Code
            let bookingCodeInput = await driver.findElement(
                 By.xpath('//input[@data-testid="track-booking-input"]')
            );

            console.log("Booking Code Global",bookingCode.toString());
            await bookingCodeInput.sendKeys(bookingCode.toString());


            //Search Booking Code
            let searchOrder = await driver.wait(
                until.elementLocated(
                    By.xpath('//button[@data-testid="track-search-button"]')
                ), 2000
            );

            await searchOrder.click();

            // Delay 2 seconds
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            // Assert Booking Code
            const bookingCodeActual = await driver.findElement(
                By.xpath('(//span[@class="info-value"])[1]')
            ).getText();

            assert.strictEqual(
                bookingCodeActual.trim(),
                bookingCode.trim(),
                `Expected booking code "${bookingCode}", but got "${bookingCodeActual}"`
            );

            console.log("Expected Booking Code:", bookingCode);
            console.log("Actual Booking Code:", bookingCodeActual);


            //Download PDF
            let downloadPDF = await driver.findElement(
                By.xpath('//button[@class="btn-submit-checkout"]')
            );

            await downloadPDF.click();

        });
    });