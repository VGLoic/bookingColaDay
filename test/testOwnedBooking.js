const zos = require('zos');
const OwnedBooking = artifacts.require('OwnedBooking');
const PartnersList = artifacts.require('PartnersList');
const assertRevert = require('./helpers/assertRevert');
const asciiToHex = require('./helpers/asciiToHex');

contract('OwnedBooking', function([_, proxyOwner, coke, pepsi, partner1, partner2, anotherAccount]) {

  beforeEach(async function() {
    let app = await zos.TestApp('zos.json', { from: proxyOwner });
    this.partnersProxy = await app.createProxy(PartnersList);
    this.cokeProxy = await app.createProxy(OwnedBooking);
    this.pepsiProxy = await app.createProxy(OwnedBooking);
    await this.partnersProxy.initialize(
      coke,
      pepsi,
      this.cokeProxy.address,
      this.pepsiProxy.address,
      [partner1, partner2],
      ['partner1', 'partner2'],
      { from: proxyOwner }
    );
  });

  describe('initialization', function() {

    describe('when the initialization has been done once', function() {

      describe('when the initialization has been done with valid addresses', function() {

        beforeEach(async function() {

          await this.cokeProxy.initialize(coke, pepsi, this.partnersProxy.address, { from: proxyOwner });
        })

        describe('Nothing to test here actually...', function() {

        })
      })

      describe('when the initialization has been done with zero address', function() {

        it('reverts', async function() {

          await assertRevert(this.cokeProxy.initialize('0x0', pepsi, this.partnersProxy.address, { from: proxyOwner }));
        })
      })
    })

    describe('when the initialization has been done twice', function() {

      it('reverts', async function() {

        await this.cokeProxy.initialize(coke, pepsi, this.partnersProxy.address, { from: proxyOwner });
        await assertRevert(this.cokeProxy.initialize(coke, pepsi, this.partnersProxy.address, { from: proxyOwner }));
      })
    })
  })

  describe('booking', function() {

    beforeEach(async function() {

      await this.cokeProxy.initialize(coke, pepsi, this.partnersProxy.address, { from: proxyOwner });
    })

    describe('when the sender is Coke', function() {

      describe('when the bookingIndex is valid', function() {

        describe('when the booker is a partner', function() {

          describe('when the booker is not Coke or Pepsi', function() {

            describe('when the bookingIndex is free', function() {

              describe('when the booker has not already booked something', function() {

                beforeEach(async function() {

                  await this.cokeProxy.bookRoom(100, partner1, { from: coke });
                })

                it('checks that the bookingIndex has been booked by partner1', async function() {

                  let name = await this.cokeProxy.getSlot(100, { from: coke });
                  assert.equal(name, asciiToHex('partner1'));
                })

                it('checks that the booking has been registered in the partner1 info', async function() {

                  let infos = await this.cokeProxy.getPartnerInfo(asciiToHex('partner1'), { from: coke });
                  assert.equal(infos.length, 2);
                  assert.equal(infos[0], true);
                  assert.equal(infos[1], 100);
                })
              })

              describe('when the booker has already booked something', function() {

                it('reverts', async function() {

                  await this.cokeProxy.bookRoom(100, partner1, { from: coke });
                  await assertRevert(this.cokeProxy.bookRoom(99, partner1, { from: coke }));
                })
              })
            })

            describe('when the bookingIndex is already booked', function() {

              it('reverts', async function() {

                await this.cokeProxy.bookRoom(100, partner2, { from: coke });
                await assertRevert(this.cokeProxy.bookRoom(100, partner1, { from: coke }));
              })
            })
          })

          describe('when the booker is Coke or Pepsi', function() {

            it('reverts', async function() {

              await assertRevert(this.cokeProxy.bookRoom(100, coke, { from: coke }));
            })

            it('reverts', async function() {

              await assertRevert(this.cokeProxy.bookRoom(100, pepsi, { from: coke }));
            })
          })
        })

        describe('when the booker is not a partner', function() {

          it('reverts', async function() {

            await assertRevert(this.cokeProxy.bookRoom(100, anotherAccount, { from: coke }));
          })
        })
      })

      describe('when the bookingIndex is not valid', function() {

        it('reverts', async function() {

          await assertRevert(this.cokeProxy.bookRoom(120, partner1, { from: coke }));
        })
      })
    })

    describe('when the sender is not Coke', function() {

      it('reverts', async function() {

        await assertRevert(this.cokeProxy.bookRoom(100, partner1, { from: pepsi }));
      })
    })
  })

  describe('cancel', function() {

    beforeEach(async function() {

      await this.cokeProxy.initialize(coke, pepsi, this.partnersProxy.address, { from: proxyOwner });
      await this.cokeProxy.bookRoom(100, partner1, { from: coke });
    })

    describe('when the sender is Coke', function() {

      describe('when the bookingIndex is valid', function() {

        describe('when the partner has booked something', function() {

          describe('when the partner has booked the corresponding bookingIndex', function() {

            beforeEach(async function() {

              await this.cokeProxy.cancelRoom(100, partner1, { from: coke });
            })

            it('checks that the bookingIndex has been released', async function() {

              let name = await this.cokeProxy.getSlot(100, { from: coke });
              assert.equal(name, asciiToHex(''));
            })

            it('checks that the partnerInfo has been updated', async function() {

              let infos = await this.cokeProxy.getPartnerInfo(asciiToHex('partner1'), { from: coke });
              assert.equal(infos.length, 2);
              assert.equal(infos[0], false);
              assert.equal(infos[1], 0);
            })

          })

          describe('when the partner has not booked the corresponding index', function() {

            it('reverts', async function() {

              await assertRevert(this.cokeProxy.cancelRoom(101, partner1, { from: coke }));
            })
          })
        })

        describe('when the booker has not booked anything', function() {

          it('reverts', async function() {

            await assertRevert(this.cokeProxy.cancelRoom(100, partner2, { from: coke }));
          })
        })
      })

      describe('when the bookingIndex is not valid', function() {

        it('reverts', async function() {

          await assertRevert(this.cokeProxy.cancelRoom(120, partner1, { from: coke }));
        })
      })
    })

    describe('when the sender is not Coke', function() {

      it('reverts', async function() {

        await assertRevert(this.cokeProxy.cancelRoom(100, partner1, { from: pepsi }));
      })
    })
  })
})
