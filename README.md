# ApplicantProject

Das Projekt war eine Aufgabe für die Firma Material One. Das Ziel war ein Bewerbungsportal aufzubauen und eine sinnvolle Ordnerstruktur, die in Zukunft alle
Framework-Elemente (Module, Komponenten, Direktiven, Pipes, etc.) beinhalten
könnte anzulegen.

Zur Entwicklung, Dinge wie die SOLID-Entwicklung, Atomicdesign, Materialdesign wurden damit gearbeitet.

Auch Dinge wie NgRx und Rxjs wurden zum Statemanagement. 

The application was built using architectural standards such as: 

- SOLID: 
  - Single Responsibility: Every file should be doing only one function, markup for markups, styles for styles and ts for coding. No inline styling. No logic in template...etc.
  -  Open for extension / closed for modification: The application should be fully configurable. The parameters are in docs that could be later connected to a content management system later also. Also, the app was done using different modules that could be taken into other applications and also be lazy loaded 
  -  Liskov Substitution: All the application following a hierarchy that works for it. 
  -  Interface: Joint logic among classes are introduced in different elements that are being implemented by them
  -  Dependency injection: All the injectables are done as one element provifded in root and incjected to all elements

- Atomic Design: The element doesn't use just one element, but a container including inside it another atomic components that could be re-used in order to reduce the amount of elements being loaded
- Material Design: it applies material design rules.
- State Management: The application uses observables in order to keep the real-time elements
- Responsiveness: The application should work for all sizes

