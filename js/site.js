(function () {
    "use strict";

    main();

    function main() {
        $.ajaxSetup({ cache: false });
        $(document).on("click", ".ci-readmore", onReadMore);

        getProjects().then(function (projects) {
            bindProjects(projects);
        });
    }

    function onReadMore(event) {
        var projectId = parseInt($(this).data("ciprojectid"));

        getProjectDetails(projectId).then(function (project) {
            if (project === undefined) {
                return;
            }

            var projectDetailsTemplate = $("#ci-projectdetails-template").html();
            var listItemTemplate = $("#ci-listitem-template").html();
            var responsibilities = "";

            for (var i = 0; i < project.responsibilities.length; i++) {
                responsibilities += listItemTemplate.replace(/{{listitem}}/g, project.responsibilities[i]);
            }

            var template = projectDetailsTemplate
                .replace(/{{type}}/g, project.type)
                .replace(/{{client}}/g, project.client || "N/A")
                .replace(/{{status}}/g, project.status)
                .replace(/{{tags}}/g, project.tags.join(", "))
                .replace(/{{text}}/g, project.text)
                .replace(/{{responsibilities}}/g, responsibilities);

            $("#ci-projectdetailslabel").text(project.title);
            $("#ci-projectdetails").html(template);
            $("#ci-projectdetailsmodal").modal("show");
        });
    }

    function bindProjects(projects) {
        var $container = $("#ci-projects");
        var columnTemplate = $("#ci-projectcolumn-template").html();
        var tagTemplate = $("#ci-projecttag-template").html();

        for (var i = 0; i < projects.length; i++) {
            var project = projects[i];
            var tags = "";

            for (var j = 0; j < project.tags.length; j++) {
                tags += tagTemplate.replace(/{{tag}}/g, project.tags[j]);
            }

            var template = columnTemplate
                .replace(/{{id}}/g, project.id)
                .replace(/{{title}}/g, project.title)
                .replace(/{{tags}}/g, tags)
                .replace(/{{text}}/g, project.text)
                .replace(/{{type}}/g, project.type);

            $container.append(template);
        }
    }

    function getProjectDetails(projectId) {
        var deferred = new $.Deferred();

        getAllProjectDetails().then(function (projectDetails) {
            var projects = projectDetails.filter(function (item, index, arr) {
                return item.id === projectId;
            });

            deferred.resolve(projects[0]);
        });

        return deferred;
    }

    function getProjects() {
        return $.ajax({
            url: "data/projects.json",
            type: "GET",
            success: function (response) {
                return response;
            },
            error: function (error) {
                console.log("An error occurred while retrieving projects");
            }
        });
    }

    function getAllProjectDetails() {
        return $.ajax({
            url: "data/projectdetails.json",
            type: "GET",
            success: function (response) {
                return response;
            },
            error: function (error) {
                console.log("An error occurred while retrieving all project details");
            }
        })
    }
})();