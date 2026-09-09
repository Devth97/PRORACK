# China machinery visit readiness


## Purpose

Prepare the ProRack team for a commercial machinery-sourcing visit covering powder-coating equipment and beam, column and racking-component production machinery. Keep travel compliance, supplier due diligence and technical integration evidence in one controlled pack.

## Traveller and visa pack

For an Indian applicant travelling for commercial activity, validate the latest M-visa requirements with the Chinese Visa Application Service Center before submission. The currently published Delhi guidance calls for:

- Original passport with at least six months' remaining validity and more than two blank visa pages, plus copies of the data/photo pages and relevant expired passports from the previous five years.
- Completed online visa application, printed and signed, plus a compliant 33 × 48 mm colour photograph on a white background.
- Invitation from the Chinese trade partner stating the traveller's details, purpose, dates, places, relationship and funding, with the inviting party's contact details, official stamp and authorized signature.
- Copy of the inviting company's business licence showing its business scope. The current Delhi guidance also asks for the responsible person's handwritten Chinese certification, signature and date on that copy.
- Copy of the inviter's or legal representative's identity document.
- Applicant covering letter or employer certification stating purpose, dates, locations and inviting-company contact details.
- Previous Chinese visa/passport evidence where applicable and proof of legal stay when applying outside the country of citizenship.

Official source: [Chinese Visa Application Service Center — Delhi, commercial trade (M)](https://visaforchina.cn/DEL4_EN/qianzhengyewu/jichuzhishi/banliliucheng/553117983266967583.html). Recheck the page and centre instructions immediately before filing because document rules can change.

## Company travel pack

- Company covering letter on letterhead, signed by an authorized signatory.
- Traveller employment/authorization letter and company ID copy.
- Company registration/GST details if requested by the processing centre or sponsor.
- Confirmed itinerary: cities, suppliers, factory visits, hotels, local transport and emergency contacts.
- Flight and accommodation evidence aligned exactly with the invitation dates.
- Travel insurance and internal approval for expenses, foreign exchange and purchasing limits.
- Copies of every submitted document in an encrypted company folder with a named owner.

## Supplier request pack — send before travel

Ask every supplier to complete one response sheet per machine:

- Manufacturer, model, serial-number format, country of origin and reference installations.
- Rated and practical capacity, supported profiles/material grades, tolerances, changeover time and scrap assumptions.
- Utilities: electrical supply, compressed air, gas, water, extraction, floor load and environmental limits.
- Footprint, foundation, guarding, safety standard, noise and emissions data.
- Controls vendor, PLC/HMI model, controller firmware and supported industrial protocols.
- Available interfaces: OPC UA, MQTT, Modbus TCP/RTU, EtherNet/IP, PROFINET, database, file exchange or vendor API.
- API/protocol documentation, sample payloads, tag list, update frequency, authentication, licensing and read/write boundaries.
- Ability to expose machine state, job/order, good quantity, reject quantity, cycle time, downtime reason, alarm and energy data.
- CNC/file formats, nesting interface and compatibility with Tekla/PowerFab or an intermediate manufacturing service.
- Warranty, commissioning, training, spares, remote support, response SLA and local service coverage in India.
- Incoterms, shipment split, packing, customs classification, installation scope, acceptance milestones and payment terms.

## Factory acceptance test

Do not accept a screen demonstration as proof of integration. Capture evidence against a prepared part and production order:

1. Load the agreed drawing/CNC file and preserve the exact input file.
2. Produce representative parts across the required material/profile range.
3. Measure output tolerances, cycle time, setup time, scrap and surface/coat quality.
4. Trigger planned stop, unplanned stop, reject and recovery cases.
5. Export or observe machine events through the offered interface and map timestamps, job IDs and quantities.
6. Confirm whether data access remains available without a vendor cloud subscription.
7. Record firmware, software, licence and interface versions.
8. Sign an exceptions list with supplier owner, correction date and retest rule.

## Digital-thread validation

For each candidate machine, demonstrate how its identifiers connect to:

`Design → BOM → Procurement → Raw Material → Production Order → Machine Job → QC Result → Inventory → Shipment → Installation → Project Completion`

At minimum, preserve project, assembly/part, material heat/batch, production order, machine job, operator/shift, QC result and shipment/installation references. A machine passes the integration gate only when the vendor provides usable documentation or an agreed export method and ProRack can reproduce the data flow independently.

## Owners and gates

Assign named owners before departure for travel/visa, commercial negotiation, mechanical engineering, electrical/controls, software/API, quality and logistics. No purchase order should be released until technical fit, FAT criteria, data-interface evidence, service support, total landed cost and contract exceptions are approved.

