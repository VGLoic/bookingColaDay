const zos = require('zos');
const PartnersList = artifacts.require('PartnersList');
const OwnedBooking = artifacts.require('OwnedBooking');
const assertRevert = require('./helpers/assertRevert');
const asciiToHex = require('./helpers/asciiToHex');

contract('PartnersList', function([_, owner, coke, pepsi, partner1, partner2, anotherAccount]) {

  beforeEach(async function() {
    let app = await zos.TestApp('zos.json', { from: owner });
    this.proxy = await app.createProxy(PartnersList);
    this.cokeProxy = await app.createProxy(OwnedBooking);
    this.pepsiProxy = await app.createProxy(OwnedBooking);
  });

  describe('when the initialization has been done once', function() {

    describe('when the initialization has been done with correct addresses', function() {

      describe('when the initialization has been done with arrays of the same length', function() {

        describe('when the initialization has been done with valid names', function() {

          beforeEach(async function() {

            await this.proxy.initialize(
              coke,
              pepsi,
              this.cokeProxy.address,
              this.pepsiProxy.address,
              [partner1, partner2],
              [
                'partner1',
                'partner2'
              ],
              { from: owner }
            );
          })

          describe('when the from is in the WhiteList', function() {

            it ('should identify coke as a partner', async function() {

              let name = await this.proxy.getPartnerName(coke, { from: pepsi });
              assert.equal(name, asciiToHex('Coke'));
            })

            it ('should identify pepsi as a partner', async function() {

              let name = await this.proxy.getPartnerName(pepsi, { from: coke });
              assert.equal(name, asciiToHex('Pepsi'));
            })

            it ('should identify partner1 as a partner', async function() {

              let name = await this.proxy.getPartnerName(partner1, { from: pepsi });
              assert.equal(name, asciiToHex('partner1'));
            })

            it ('should identify partner2 as a partner', async function() {

              let name = await this.proxy.getPartnerName(partner2, { from: pepsi });
              assert.equal(name, asciiToHex('partner2'));
            })

            it ('should identify anotherAccount as a non-partner', async function() {

              let name = await this.proxy.getPartnerName(anotherAccount, { from: pepsi });
              assert.equal(name, asciiToHex(''));
            })

            it ('should identify owner as a non-partner', async function() {

              let name = await this.proxy.getPartnerName(owner, { from: pepsi });
              assert.equal(name, asciiToHex(''));
            })
          })

          describe('when the from is not in the WhiteList', function() {

            it('reverts', async function() {

              await assertRevert(this.proxy.getPartnerName(partner1, { from: partner2 }));
            })
          })
        })

        describe('when the initialization has been done with empty names', function() {

          it('reverts', async function() {

            await assertRevert(this.proxy.initialize(coke, pepsi, this.cokeProxy.address, this.pepsiProxy.address, [partner1, partner2], ['', 'partner2'], { from: owner }));
          })
        })
      })

      describe('when the initialization has been done with arrays of different lengths', function() {

        it('reverts', async function() {

          await assertRevert(this.proxy.initialize(coke, pepsi, this.cokeProxy.address, this.pepsiProxy.address, [partner1, partner2, anotherAccount], ['partner1', 'partner2'], { from: owner }));
        })
      })
    })

    describe('when the initialization has been done with empty addresses', function() {

      it('reverts', async function() {

        await assertRevert(this.proxy.initialize(coke, pepsi, this.cokeProxy.address, this.pepsiProxy.address, ['0x0', partner2], ['partner1', 'partner2'], { from: owner }));
      })
    })
  })

  describe('when the initialization is done twice', function() {

    it('reverts', async function() {

      await this.proxy.initialize(coke, pepsi, this.cokeProxy.address, this.pepsiProxy.address, [partner1, partner2], ['partner1', 'partner2'], { from: owner });
      await assertRevert(this.proxy.initialize(coke, pepsi, this.cokeProxy.address, this.pepsiProxy.address, [partner1, partner2], ['partner1', 'partner2'], { from: owner }));
    })
  })
})
