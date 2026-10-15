window.App = window.App || {};

(function (App) {
  App.companies = {
    normalize(company) {
      return {
        Number: company?.Number ?? "",
        CompanyNameProject: company?.CompanyNameProject ?? "",
        Brand: company?.Brand ?? "",
        LicenseApprovalNumber: company?.LicenseApprovalNumber ?? "",
        GovernorateName: company?.GovernorateName ?? "",
        GrantingLicenseApproval: company?.GrantingLicenseApproval ?? "",
        LicenseApprovalDate: company?.LicenseApprovalDate ?? "",
        LicenseTextSpecialization: company?.LicenseTextSpecialization ?? "",
        CargoDetails: company?.CargoDetails ?? "",
        TypeIndustryProduction: company?.TypeIndustryProduction ?? "",
        Unit: company?.Unit ?? ""
      };
    },

    tokens(company) {
      const normalized = this.normalize(company);
      return [
        normalized.Number,
        normalized.CompanyNameProject,
        normalized.Brand,
        normalized.LicenseApprovalNumber,
        normalized.GovernorateName,
        normalized.GrantingLicenseApproval,
        normalized.LicenseTextSpecialization,
        normalized.CargoDetails,
        normalized.TypeIndustryProduction,
        normalized.Unit
      ].map(function (value) {
        return App.utils.normalizeSearchText(value);
      }).filter(Boolean);
    },

    search(query, limit = 20) {
      const normalizedQuery = App.utils.normalizeSearchText(query);
      if (!normalizedQuery) return [];

      return App.state.companies.filter((company) => {
        return this.tokens(company).some(function (value) {
          return value.includes(normalizedQuery);
        });
      }).slice(0, limit);
    },

    localCompanies() {
      const entries = [];
      try {
        if (App.storage?.hasDoc?.()) entries.push(App.storage.getDoc());
        entries.push(...(App.storage?.getTraderLedger?.() || []));
      } catch (error) { console.warn("Local company records unavailable", error); }
      const unique = new Map();
      entries.forEach((entry) => {
        const name = String(entry?.company_name_project || "").trim();
        const key = App.utils.normalizeSearchText(name);
        if (!key) return;
        if (unique.get(key)?.LicenseApprovalNumber) return;
        unique.set(key, this.normalize({
          Number: entry.company_number || "",
          CompanyNameProject: name,
          Brand: entry.brand || "",
          LicenseApprovalNumber: entry.license_approval_number || "",
          GovernorateName: entry.governorate_name || "",
          GrantingLicenseApproval: entry.granting_license_approval || "",
          LicenseApprovalDate: entry.license_approval_date || "",
          LicenseTextSpecialization: entry.license_text_specialization || "",
          CargoDetails: entry.cargo_typedetails || "",
          TypeIndustryProduction: entry.item_name || "",
          Unit: entry.unit || ""
        }));
      });
      return [...unique.values()];
    },

    async load() {
      if (this._loaded) return App.state.companies;
      if (this._loading) return this._loading;
      this._loading = (async () => {
        try {
          const response = await fetch("data/companies.json", { cache: "no-store" });
          if (!response.ok) throw new Error("Missing companies database");
          const data = await response.json();
          if (!Array.isArray(data)) throw new Error("Invalid companies database");
          App.state.companies = data;
          App.utils.showStatus(`تم تحميل ${data.length} شركة من قاعدة البيانات`, "success");
        } catch (error) {
          App.state.companies = this.localCompanies();
          const count = App.state.companies.length;
          App.utils.showStatus(
            count
              ? `ملف الشركات غير موجود. يمكن البحث في ${count} شركة من سجلاتك المحلية فقط.`
              : "قاعدة بيانات الشركات غير موجودة في المستودع. يمكنك إدخال الوثيقة يدوياً من صفحة التعبئة.",
            count ? "info" : "error"
          );
          console.warn("Companies database unavailable; using local records only", error);
        }
        this._loaded = true;
        return App.state.companies;
      })();
      return this._loading;
    },

    fillForm(company) {
      const normalized = this.normalize(company);
      App.dom.setFormValue("company_name_project", normalized.CompanyNameProject);
      App.dom.setFormValue("governorate_name", normalized.GovernorateName);
      App.dom.setFormValue("granting_license_approval", normalized.GrantingLicenseApproval);
      App.dom.setFormValue("license_approval_number", normalized.LicenseApprovalNumber);
      App.dom.setFormValue("license_approval_date", normalized.LicenseApprovalDate);
      App.dom.setFormValue("license_text_specialization", normalized.LicenseTextSpecialization);
      App.dom.setFormValue("brand", normalized.Brand);
      App.dom.setFormValue("cargo_typedetails", normalized.CargoDetails || normalized.TypeIndustryProduction);
      App.dom.setFormValue("item_name", normalized.TypeIndustryProduction || normalized.CargoDetails);
      App.dom.setFormValue("production_capacity", "");
      App.dom.setFormValue("unit", normalized.Unit);
    },

    findByNumber(number) {
      const normalizedNumber = App.utils.normalizeSearchText(number);
      return App.state.companies.find(function (entry) {
        return App.utils.normalizeSearchText(entry.Number) === normalizedNumber;
      }) || null;
    }
  };
})(window.App);
