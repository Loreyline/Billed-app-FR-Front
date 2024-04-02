/**
 * @jest-environment jsdom
 */


import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { fireEvent, screen, waitFor } from "@testing-library/dom"
import userEvent from '@testing-library/user-event'
import DashboardFormUI from "../views/DashboardFormUI.js"
import DashboardUI from "../views/DashboardUI.js"
import Dashboard, { filteredBills, cards } from "../containers/Dashboard.js"
import { ROUTES, ROUTES_PATH } from "../constants/routes"
import { localStorageMock } from "../__mocks__/localStorage.js"
import mockStore from "../__mocks__/store"
import { bills } from "../fixtures/bills"
import router from "../app/Router"

jest.mock("../app/store", () => mockStore)


describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then mail icon in vertical layout should be highlighted", async () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId('icon-mail'))
      const windowIcon = screen.getByTestId('icon-mail')
      //to-do write expect expression
      expect(windowIcon).toBeTruthy()
    })

    test("It should not make a new bill if the picture is not jpg png..", async () => {
      // codes
      document.body.innerHTML = NewBillUI();
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      // instance of NewBill
      const testNewbill = new NewBill({ document, onNavigate, localStorage: window.localStorage, store: mockStore })
      // submit button
      const submitBtn = screen.getByTestId("form-new-bill")
      const newFile = new File(["image"], "file.gif", { type: "image/gif" })
      const resultUpload = await testNewbill.uploadFile(newFile)
      expect(resultUpload).toBeFalsy()
    })

    describe("When I fill up the forms correctly and click submit button", () => {
      test("It should make a new bill", async () => {
        // codes
        document.body.innerHTML = NewBillUI();
        Object.defineProperty(window, 'localStorage', { value: localStorageMock })
        window.localStorage.setItem('user', JSON.stringify({
          type: 'Employee'
        }))
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname })
        }
        // instance of NewBill
        const testNewbill = new NewBill({ document, onNavigate, localStorage: window.localStorage, store: mockStore })
        // submit button
        const submitBtn = screen.getByTestId("form-new-bill")
        const newFile = new File(["image"], "file.jpeg", { type: "image/jpeg" })
        const resultUpload = await testNewbill.uploadFile(newFile)
        expect(resultUpload).toBeTruthy()

        // mock data
        const inputData = {
          id: "47qAXb6fIm2zOKkLzMro",
          vat: "80",
          fileUrl: "public\\4b392f446047ced066990b0627cfa444",
          status: "pending",
          type: "Hôtel et logement",
          commentary: "séminaire billed",
          name: "encore",
          fileName: "file.jpg",
          date: "2004-04-04",
          amount: 400,
          commentAdmin: "ok",
          pct: 20
        }

        screen.getByTestId("expense-type").value = inputData.type
        screen.getByTestId("expense-name").value = inputData.name
        screen.getByTestId("amount").value = inputData.amount
        screen.getByTestId("datepicker").value = inputData.date
        screen.getByTestId("vat").value = inputData.vat
        screen.getByTestId("pct").value = inputData.pct
        screen.getByTestId("commentary").value = inputData.commentary
        testNewbill.fileName = inputData.fileName
        testNewbill.fileUrl = inputData.fileUrl
        testNewbill.updateBill = jest.fn()
        const handleSubmit = jest.fn((e) => { testNewbill.handleSubmit(e) })
        submitBtn.addEventListener("submit", handleSubmit)
        fireEvent.submit(submitBtn)
        expect(handleSubmit).toHaveBeenCalled()
        expect(testNewbill.updateBill).toHaveBeenCalled()
      })
    })
  })
})
