import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, FormArray, Validators } from '@angular/forms'
import * as pdfMake from 'pdfmake/build/pdfmake.js';
import * as pdfFonts from 'pdfmake/build/vfs_fonts.js';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-basic-form',
  templateUrl: './basic-form.component.html',
  styleUrls: ['./basic-form.component.scss']
})
export class BasicFormComponent implements OnInit {

  basicForm: FormGroup;


  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.basicForm = this.fb.group({
      name: '',
      address: '',
      email: ['', [Validators.required, Validators.email]],
      phone: '',
      objective: '',
      educations: this.fb.array([]),
      compEducations: this.fb.array([]),
      experiences: this.fb.array([]),
      skills: this.fb.array([]),
      idioms: this.fb.array([]),
    })

    this.basicForm.valueChanges.subscribe(console.log)
  };
  //
  get educationForms() { return this.basicForm.get('educations') as FormArray }
  get educationFormsObj() {
    const value = (this.basicForm.get('educations') as FormArray)?.value;
    return value?.map(({ institution, course, courseEnd }) => ([
      {
        text: [
          { text: institution.toUpperCase(), style: 'header3' },
          ',  (', courseEnd, ') \n',
          { text: course, style: 'simpleText' },
        ], style: 'superMargin',
      },
    ]))
  }

  get compEducationForms() { return this.basicForm.get('compEducations') as FormArray }
  get compEducationFormsObj() {
    const value = (this.basicForm.get('compEducations') as FormArray)?.value;
    return value?.map(({ compInstitution, compCourse }) => ([
      {
        text: [
          { text: compInstitution.toUpperCase(), style: 'header3' },
          '\n',
          { text: compCourse, style: 'simpleText' },
        ], style: 'superMargin',
      },
    ]))
  }
  get experienceForms() { return this.basicForm.get('experiences') as FormArray }
  get experienceFormsObj() {
    const value = (this.basicForm.get('experiences') as FormArray)?.value;
    return value?.map(({ jobCompany, jobTitle, jobStart, jobEnd, jobDescription }) => ([
      {
        text: [
          { text: jobCompany.toUpperCase(), style: 'header3' },
          ',  ', jobTitle, ' - (', jobStart, '  -   ', jobEnd, ')', '\n',
          { text: jobDescription, style: 'simpleText' },
          '\n'
        ], style: 'superMargin',
      }
    ]))
  }
  get skillForms() { return this.basicForm.get('skills') as FormArray }
  get idiomForms() { return this.basicForm.get('idioms') as FormArray }
  get idiomFormsObj() {
    const value = (this.basicForm.get('idioms') as FormArray)?.value;
    return value?.map(({ language, languageLevel }) => ([
      {
        text: [
          { text: language, style: 'header3' },
          ':',
          { text: languageLevel, style: 'simpleText' },
          '\n'
        ], style: 'superMargin',
      }
    ]))
  }

  // Method to divide skills in 3 columns
  get orderedSkills() {
    const items = this.skillForms.value
    return [0, 1, 2].map((ix) => {
      return {
        ul: [
          ...items.filter((value, index) => index % 3 === ix).map(s => s.skillDescription)
        ]
      }
    })
  }

  //  Method to set an input text to Uppercase
  changeTextToUppercase(field) {
    const obj = {};
    obj[field] = this.basicForm.controls[field].value.toUpperCase();
    this.basicForm.patchValue(obj);
  }



  //  Method to add fields in resume
  addEducation() {
    const education = this.fb.group({ degree: [], institution: [], course: [], courseEnd: [] });
    this.educationForms.push(education);
  }
  addCompEducation() {
    const compEducation = this.fb.group({ compInstitution: [], compCourse: [], })
    this.compEducationForms.push(compEducation);
  }
  addExperience() {
    const experience = this.fb.group({ jobCompany: [], jobTitle: [], jobStart: [], jobEnd: [], jobDescription: [], })
    this.experienceForms.push(experience);
  }
  addSkill() {
    const skill = this.fb.group({ skillDescription: [], })
    this.skillForms.push(skill);
  }
  addIdiom() {
    const idiom = this.fb.group({ language: [], languageLevel: [], })
    this.idiomForms.push(idiom);
  }

  //  Method to delete fields in resume
  deleteEducation(i: number) {
    this.educationForms.removeAt(i)
  }
  deleteCompEducation(i: number) {
    this.compEducationForms.removeAt(i)
  }
  deleteExperience(i: number) {
    this.experienceForms.removeAt(i)
  }
  deleteSkill(i: number) {
    this.skillForms.removeAt(i)
  }
  deleteIdiom(i: number) {
    this.idiomForms.removeAt(i)
  }



  //--------------------------------------------------

  generatePDF() {
    let docDefinition = {
      pageMargins: [40, 20, 40, 60],
      pageSize: 'A4',
      info: {
        title: 'CV',
        author: 'Douglas Yuji Yabuki',
      },
      content: [

        {
          text: this.basicForm.get('name')?.value.toUpperCase(),
          style: 'header'
        },
        /*--------------------------------*/
        { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 2 }] },
        {
          text: 'Contato',
          style: 'header2'
        },
        {
          text: [
            { text: 'Endereço:', style: 'header3' },
            { text: this.basicForm.get('address')?.value, style: 'simpleText' },
            '\n'
          ],
        },
        {
          text: [
            { text: 'E-mail:', style: 'header3' },
            { text: this.basicForm.get('email')?.value, style: 'simpleText' },
            '\n'
          ]
        },
        {
          text: [
            { text: 'Telefone:', style: 'header3' },
            { text: this.basicForm.get('phone')?.value, style: 'simpleText' },
            '\n'
          ],
          style: 'superMargin',
        },
        /*--------------------------------*/
        { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1 }] },
        {
          text: 'Objetivo',
          style: 'header2'
        },
        {
          text: this.basicForm.get('objective')?.value,
          style: 'simpleText'
        },
        /*--------------------------------*/
        { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1 }] },
        {
          text: 'Educação',
          style: 'header2'
        },
        ...this.educationFormsObj,

        /*--------------------------------*/
        { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1 }] },
        {
          text: 'Educação Complementar',
          style: 'header2'
        },
        ...this.compEducationFormsObj,
        /*--------------------------------*/
        { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1 }] },
        {
          text: 'Experiência Profissional',
          style: 'header2'
        },
        ...this.experienceFormsObj,

        /*--------------------------------*/
        { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1 }] },
        { text: 'Habilidades', style: 'header2' },
        {
          columns: this.orderedSkills, style: 'superMargin',
        },
        /*--------------------------------*/
        { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1 }] },
        {
          text: 'Idiomas',
          style: 'header2'
        },
        ...this.idiomFormsObj,

        { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1 }] },


        //ESTILOS
      ],
      styles: {
        header: {
          alignment: 'center',
          fontSize: 22,
          margin: [10, 25, 0, 40],
          bold: true,
        },
        header2: {
          alignment: 'left',
          fontSize: 12,
          color: '#2E608C',
          margin: [0, 10, 0, 10],
          bold: true,
        },
        header3: {
          alignment: 'left',
          fontSize: 12,
          margin: [0, 10, 0, 10],
          bold: true,
        },
        simpleText: {
          alignment: 'left',
          margin: [0, 10, 0, 10],
          fontSize: 11,
        },
        superMargin: {
          margin: [0, 0, 0, 10]
        }
      }
    }
    pdfMake.createPdf(docDefinition).open();
  }

}
